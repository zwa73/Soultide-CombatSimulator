import { AddiDamageType, DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusKey, StaticStatusOption } from "./Status";
import { AnyHook, AnyTigger, HookTiggerMap } from "./Tigger";

//———————————————————— 调整值 ————————————————————//


/**加成类型 区分乘区 */
export type ModifyType = DamageType|`${SkillCategory}伤害`|AddiDamageType|
    "技能伤害"|"暴击伤害"|"攻击"|"所有伤害"|"伤害系数";



/**伤害具体类型约束 Damage Info Constraint*/
export type DamageConsType=SkillType|SkillRange|SkillCategory|SkillSubtype|DamageType|"受击时"|"平常时"|SkillName;
/**伤害约束 或 数组或单独的伤害约束组成*/
export type DamageConsOr  = ReadonlyArray<DamageConsType>|DamageConsType;
/**伤害约束 与 N个伤害约束或组成*/
export type DamageConsAnd = ReadonlyArray<DamageConsOr>


/**判断 info 是否包含 target 的所有约束字段
 * cons 如不包含 "受击时" 或 "平常时" 则视为包含 "平常时"
 * @param isHurt 是受到攻击一方的buff 即匹配 "受击时" 约束 否则匹配 "平常时"
 * @param info   伤害信息
 * @param cons   约束列表
 */
export function matchCons(isHurt:boolean=false,info?:DamageInfo,cons?:DamageConsAnd){
    if(cons==null || cons.length<=0) cons=[];
    //判断 "受击时" 或 "平常时"
    const hasHurtFlag = cons.some(con => {
        const orlist = Array.isArray(con) ? con as DamageConsType[] : [con] as DamageConsType[];
        return orlist.some(or => or.includes("受击时") || or.includes("平常时"));
    });
    //判断 hurtflag
    if(!hasHurtFlag) cons = [...cons,"平常时"];

    //展开info
    let infos:DamageConsType[]=[];
    if(info!=null)
        Object.values(info).forEach(element => infos.push(element));
    if(isHurt) infos.push("受击时");
    else infos.push("平常时");


    //遍历约束 判断infos是否包含所有的And
    for(let con of cons){
        let orlist = Array.isArray(con)? con as DamageConsType[]:[con] as DamageConsType[];
        //判断infos是否包含任意的Or
        for(let or of orlist){
            if(infos.includes(or)) continue;
            return false;
        }
    }
    return true;
}


/**累加的调整值表 */
export type ModTableSet = {
    /**倍率调整表 */
    multModTable:StaticStatusOption,
    /**加值调整表 */
    addModTable:StaticStatusOption,
}
export type ModSet = {
    add:number,
    mult:number
}

/**附加状态 */
export type Buff={
    /**名称 */
    readonly name:string;
    /**可叠加 */
    readonly canSatck?:boolean;
    /**结束时间点 下一次hook触发时结束*/
    readonly endWith?:AnyHook;
    /**倍率增益 */
    readonly multModify?:StaticStatusOption;
    /**叠加的倍率增益 */
    readonly stackMultModify?:StaticStatusOption;
    /**数值增益 */
    readonly addModify?:StaticStatusOption;
    /**叠加的数值增益 */
    readonly stackAddModify?:StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    readonly damageCons?:DamageConsAnd;
    /**触发器 */
    readonly tiggerList?:AnyTigger[];
}
/**叠加的buff */
export type BuffStack={
    /**buff类型 */
    buff:Buff,
    /**叠加层数 */
    stack:number,
    /**持续时间倒计时 */
    duration:number,
}
/**buff表 */
export class BuffTable{
    private _table:Record<string,BuffStack>={};
    constructor(){}
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff:Buff,stack:number=1,duration:number=Infinity){
        if(this._table[buff.name]==null || buff.canSatck!=true)
            this._table[buff.name]={ buff, stack, duration };
        else{
            let cadd = this._table[buff.name];
            cadd.stack+=stack;
        }
    }
    /**获取一个Buff的层数 */
    getBuffStack(key:string):number{
        if(this._table[key]==null || this._table[key].stack<=0)
            return 0;
        return this._table[key].stack;
    }
    /**获取buff持续时间 */
    getBuffDuration(key:string):number{
        if(this._table[key]==null || this._table[key].duration<=0)
            return 0;
        return this._table[key].duration;
    }
    /**是否含有某个有效的buff */
    hasBuff(key:string):boolean{
        return this.getBuffStack(key)>0 && this.getBuffDuration(key)>0;
    }
    /**结算回合 */
    endRound(){
        for(let k in this._table){
            let buff = this._table[k];
            if(buff.duration>0)
                buff.duration-=1;
            if(buff.duration<=0)
                this.removeBuff(k);
        }
    }
    /**移除某个buff */
    removeBuff(key:string){
        this._table[key].stack=0;
        this._table[key].duration=0;
    }
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    modValue(base:number,field:StaticStatusKey,isHurt?:boolean,damageInfo?:DamageInfo):number{
        let modset = this.getModSet(field,isHurt,damageInfo);
        return (base+modset.add)*modset.mult;
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSet(field:StaticStatusKey,isHurt?:boolean,damageInfo?:DamageInfo):ModSet{
        let mult = 1;
        let add  = 0;
        for(let buffName in this._table){
            let stackData = this._table[buffName];
            let buff = stackData.buff;
            let stack = stackData.stack;

            if(buff.damageCons!=null && matchCons(isHurt,damageInfo,buff.damageCons)) continue;

            if(buff.multModify)
                mult += buff.multModify[field]||0;
            if(buff.stackMultModify)
                mult += stack * (buff.stackMultModify[field]||0);

            if(buff.addModify)
                add += buff.addModify[field]||0;
            if(buff.stackAddModify)
                add += stack * (buff.stackAddModify[field]||0);
        }
        return {add,mult};
    }
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModTableSet(isHurt?:boolean,damageInfo?:DamageInfo):ModTableSet{
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item=>matchCons(isHurt,damageInfo,item.buff.damageCons));
        //console.log("vaildList",vaildList)
        const multModTable:StaticStatusOption={};
        const addModTable :StaticStatusOption={};
        //叠加乘区
        function stackMultArean(baseMap:StaticStatusOption,modMap:StaticStatusOption,stack:number){
            for(let flag of Object.keys(modMap) as StaticStatusKey[]){
                if(baseMap[flag]==null) baseMap[flag]=1;
                baseMap[flag]!+=modMap[flag]!*stack;
            }
        }
        function stackAddArean(baseMap:StaticStatusOption,modMap:StaticStatusOption,stack:number){
            for(let flag of Object.keys(modMap) as StaticStatusKey[]){
                if(baseMap[flag]==null) baseMap[flag]=0;
                baseMap[flag]!+=modMap[flag]!*stack;
            }
        }
        for(const item of vaildList){
            const basedMultTable = item.buff.multModify||{};
            const stackMultTable = item.buff.stackMultModify||{};
            const basedAddTable  = item.buff.addModify||{};
            const stackAddTable  = item.buff.stackAddModify||{};
            const stack = item.stack;
            //叠加同乘区
            stackMultArean(multModTable, basedMultTable, 1      );
            stackMultArean(multModTable, stackMultTable, stack  );
            stackAddArean (addModTable , basedAddTable , 1      );
            stackAddArean (addModTable , stackAddTable , stack  );
        }
        //console.log("addModTable",addModTable)

        return {
            /**倍率调整表 */
            multModTable: multModTable,
            /**加值调整表 */
            addModTable: addModTable
        };
    }
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook:T):HookTiggerMap[T][] {
        //索引触发器类型
        type TT = HookTiggerMap[T];
        //触发器数组
        let arr:TT[]=[];
        for (const key in this._table){
            if(!this.hasBuff(key)) continue;
            let obj = this._table[key];
            if(obj.buff.tiggerList==null) continue;
            for(const tigger of obj.buff.tiggerList){
                if(tigger.hook==hook)
                    arr.push(tigger as TT);
            }
        }
        arr.sort((a, b) => (b.weight||0) - (a.weight||0));
        return arr;
    }
    clone():BuffTable{
        let nbuff = new BuffTable();
        for(let i in this._table){
            nbuff._table[i].buff = this._table[i].buff;
            nbuff._table[i].stack = this._table[i].stack;
        }
        return nbuff;
    }
};


function addAddTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
    for (let flag of Object.keys(modTable) as StaticStatusKey[]) {
        if (baseTable[flag] == null) baseTable[flag] = 0;
        baseTable[flag]! += modTable[flag]!;
    }
}
function addMultTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
    for (let flag of Object.keys(modTable) as StaticStatusKey[]) {
        if (baseTable[flag] == null) baseTable[flag] = 1;
        baseTable[flag]! += (modTable[flag]!-1);
    }
}
function multMultTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
    for (let flag of Object.keys(modTable) as StaticStatusKey[]) {
        if (baseTable[flag] == null) baseTable[flag] = 1;
        baseTable[flag]! *= modTable[flag]!;
    }
}
function addTableSet(baseSet: ModTableSet, modSet: ModTableSet) {
    addMultTable(baseSet.multModTable, modSet.multModTable);
    addAddTable(baseSet.addModTable, modSet.addModTable);
}
function multTableSet(baseSet: ModTableSet, modSet: ModTableSet) {
    multMultTable(baseSet.multModTable, modSet.multModTable);
    addAddTable(baseSet.addModTable, modSet.addModTable);
}
/**对ModTableSet进行加运算 乘区加算 加值加算*/
export function addModTableSet(...sets:ModTableSet[]):ModTableSet{
    const outset:ModTableSet = { addModTable: {}, multModTable: {} };
    for(let set of sets)
        addTableSet(outset,set);
    return outset;
}
/**对ModTableSet进行乘运算 乘区乘算 加值加算*/
export function multModTableSet(...sets:ModTableSet[]):ModTableSet{
    const outset:ModTableSet = { addModTable: {}, multModTable: {} };
    for(let set of sets)
        multTableSet(outset,set);
    return outset;
}

export function addModSet(...sets:ModSet[]):ModSet{
    let baseSet:ModSet={add:0,mult:1};
    for(let set of sets){
        baseSet.add += set.add;
        baseSet.mult += (set.mult-1);
    }
    return baseSet;
}
export function multModSet(...sets:ModSet[]):ModSet{
    let baseSet:ModSet={add:0,mult:1};
    for(let set of sets){
        baseSet.add += set.add;
        baseSet.mult *= set.mult;
    }
    return baseSet;
}
export const DefModSet:ModSet = {add:0,mult:1};
export const DefModTableSet: ModTableSet = { addModTable: {}, multModTable: {} };