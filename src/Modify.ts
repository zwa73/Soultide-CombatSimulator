import { IJData, deepClone } from "@zwa73/utils";
import { AddiDamageType, DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusOption } from "./Status";
import { AnyHook, AnyTrigger, HookTriggerMap } from "./Trigger";

//———————————————————— 调整值 ————————————————————//

type ModiftTypeBase = "最大生命"|"速度"|"防御"|"初始怒气"|"闪避"|"最大怒气"|"怒气回复";
type ModifyTypeAtk  = DamageType|`${SkillCategory}伤害`|`${SkillRange}伤害`|AddiDamageType|
    "技能伤害"|"攻击"|"暴击率"|"暴击伤害"|"所有伤害"|"伤害系数"|"穿透防御";
/**加成类型 区分乘区 */
export type ModifyType = ModifyTypeAtk|`受到${ModifyTypeAtk}`|ModiftTypeBase;



/**伤害具体类型约束 Damage Info Constraint*/
export type DamageConsType=SkillType|SkillRange|SkillCategory|SkillSubtype|DamageType|SkillName;
/**伤害约束 或 数组或单独的伤害约束组成*/
export type DamageConsOr  = ReadonlyArray<DamageConsType>|DamageConsType;
/**伤害约束 与 N个伤害约束或组成*/
export type DamageConsAnd = ReadonlyArray<DamageConsOr>


/**判断 info 是否包含 target 的所有约束字段
 * @param info   伤害信息
 * @param cons   约束列表
 */
export function matchCons(info?:DamageInfo,cons?:DamageConsAnd){
    if(cons==null || cons.length<=0) cons=[];

    //展开info
    let infos:DamageConsType[]=[];
    if(info!=null)
        Object.values(info).forEach(element => infos.push(element));

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

export type BuffType = "正面效果"|"负面效果"|"控制效果"|"其他效果";

/**buff的详细信息 */
export type BuffInfo={
    readonly buffName:BuffName;
    readonly buffType:BuffType;
}

export function genBuffInfo(buffName:BuffName,buffType:BuffType):BuffInfo{
    return {buffName,buffType};
}

/**附加效果 */
export type Buff={
    /**名称 */
    readonly info:BuffInfo;
    /**可叠加 重复获得时 层数叠加 默认覆盖*/
    readonly canSatck?:boolean;
    /**叠加上限 可以存在的最大层数 默认无限*/
    readonly stackLimit?:number;
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
    readonly triggerList?:AnyTrigger[];
}
export type BuffName = `效果:${string}`;

/**叠加的buff */
export type BuffStack={
    /**buff类型 */
    buff:Buff,
    /**叠加层数 */
    stack:number,
    /**持续时间倒计时 */
    duration:number,
    /**额外的表 */
    dataTable?:Record<string,any>
}
/**buff表 */
export class BuffTable{
    private _table:Record<BuffName,BuffStack|undefined>={};
    constructor(){}
    /**添加一个buff
     * @deprecated 这个函数仅供Character.addBuff 或内部调用
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff:Buff,stack:number=1,duration:number=Infinity){
        if(this._table[buff.info.buffName]==null || buff.canSatck!=true)
            this._table[buff.info.buffName]={ buff, stack, duration };
        else{
            let stakcbuff = this._table[buff.info.buffName]!;
            stakcbuff.stack+=stack;
            if(buff.stackLimit!=null && stakcbuff.stack>buff.stackLimit)
                stakcbuff.stack = buff.stackLimit;
        }
        this.checkBuff(buff);
    }
    /**获取一个Buff的层数 不会触发触发器
     * @deprecated 这个函数仅供Character.getBuffStackCountWithoutT 或内部调用
     */
    getBuffStackCount(buff:Buff):number{
        let bs = this.getBuffStack(buff);
        if(bs==null || bs.stack<=0)
            return 0;
        return bs.stack;
    }
    /**获取一个Buff
     * @deprecated 这个函数仅供Character.getBaseStatus调用
     */
    getBuff(key:BuffName):Buff|undefined{
        return this._table[key]?.buff;
    }
    /**获取buff持续时间 */
    getBuffDuration(buff:Buff):number{
        let bs = this.getBuffStack(buff);
        if(bs==null || bs.duration<=0)
            return 0;
        return bs.duration;
    }
    /**获取BuffStack */
    getBuffStack(buff:Buff):BuffStack|undefined{
        return this._table[buff.info.buffName];
    }
    /**是否含有某个有效的buff */
    hasBuff(buff:Buff):boolean{
        return this.getBuffStackCount(buff)>0 && this.getBuffDuration(buff)>0;
    }
    /**检查buff是否有效 无效则移除*/
    private checkBuff(buff:Buff):boolean{
        let stackBuff = this._table[buff.info.buffName];
        if(stackBuff==null) return false;
        //console.log("stackBuff",stackBuff.buff.info.buffName,stackBuff.duration,stackBuff.stack)
        if(stackBuff.duration<=0){
            this.removeBuff(stackBuff.buff);
            return false;
        }
        if(stackBuff.stack<=0){
            this.removeBuff(stackBuff.buff);
            return false;
        }
        return true;
    }
    /**结算回合 */
    endRound(){
        for(let k in this._table){
            let stackbuff = this._table[k as BuffName];
            if(stackbuff==null) continue;
            if(stackbuff.duration>0)
                stackbuff.duration-=1;
            this.checkBuff(stackbuff.buff);
        }
    }
    /**移除某个buff */
    removeBuff(buff:Buff){
        let bs = this.getBuffStack(buff);
        if(bs==null)return;
        bs.stack=0;
        bs.duration=0;
        delete bs["dataTable"];
        delete this._table[buff.info.buffName];
    }
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param damageInfo 伤害信息
     */
    modValue(base:number,field:ModifyType,damageInfo?:DamageInfo):number{
        let modset = this.getModSet(field,damageInfo);
        return modset.modValue(base);
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param damageInfo 伤害信息
     */
    getModSet(field:ModifyType,damageInfo?:DamageInfo):ModSet{
        let mult = 1;
        let add  = 0;
        for(let buffName in this._table){
            let stackData = this._table[buffName as BuffName];
            if(stackData==null) continue;
            let buff = stackData.buff;
            let stack = stackData.stack;

            if(buff.damageCons!=null && matchCons(damageInfo,buff.damageCons)) continue;

            if(buff.multModify)
                mult += buff.multModify[field]||0;
            if(buff.stackMultModify)
                mult += stack * (buff.stackMultModify[field]||0);

            if(buff.addModify)
                add += buff.addModify[field]||0;
            if(buff.stackAddModify)
                add += stack * (buff.stackAddModify[field]||0);
        }
        return new ModSet(add,mult);
    }
    /**获取伤害约束的Buff调整值表 不会触发触发器
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSetTable(damageInfo?:DamageInfo):ModSetTable{
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item=>matchCons(damageInfo,item?.buff.damageCons));
        //console.log("vaildList",vaildList)
        const multModTable:StaticStatusOption={};
        const addModTable :StaticStatusOption={};
        //叠加乘区
        function stackMultArean(baseMap:StaticStatusOption,modMap:StaticStatusOption,stack:number){
            for(let flag of Object.keys(modMap) as ModifyType[]){
                if(baseMap[flag]==null) baseMap[flag]=1;
                baseMap[flag]!+=modMap[flag]!*stack;
            }
        }
        function stackAddArean(baseMap:StaticStatusOption,modMap:StaticStatusOption,stack:number){
            for(let flag of Object.keys(modMap) as ModifyType[]){
                if(baseMap[flag]==null) baseMap[flag]=0;
                baseMap[flag]!+=modMap[flag]!*stack;
            }
        }
        for(const item of vaildList){
            if(item==null) continue;
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
        return new ModSetTable(addModTable,multModTable);
    }
    /**获取buffTable中所有对应触发器 不包括全局触发器
     * @deprecated 这个函数仅供Character.getTiggers 或内部调用
     */
    getTriggers<T extends AnyHook>(hook:T):HookTriggerMap[T][] {
        //索引触发器类型
        type TT = HookTriggerMap[T];
        //触发器数组
        let arr:TT[]=[];
        for (const key in this._table){
            let bs = this._table[key as BuffName];
            if(bs==null) continue;
            if(!this.hasBuff(bs.buff)) continue;
            if(bs.buff.triggerList==null) continue;
            for(const tigger of bs.buff.triggerList){
                if(tigger.hook==hook)
                    arr.push(tigger as TT);
            }
        }
        arr.sort((a, b) => (b.weight||0) - (a.weight||0));
        return arr;
    }
    clone():BuffTable{
        let nbuff = new BuffTable();
        for(let key in this._table){
            let bn = key as BuffName;
            let bs = this._table[bn];
            if(bs==null) continue;
            const {dataTable,...rest}=bs;
            let nbs:BuffStack = {
                ...rest,
                dataTable:{}
            };
            nbuff._table[bn] = nbs;
        }
        return nbuff;
    }
};
/**对某个属性的调整组 */
export class ModSet implements IJData{
    readonly add:number;
    readonly mult:number;
    constructor(add:number=0,mult:number=1){
        this.add = add;
        this.mult = mult;
    }
    /**对某个值进行增益 */
    modValue(base:number):number{
        return (base+this.add)*this.mult;
    }
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    addSet(...sets:ModSet[]):ModSet{
        return ModSet.addSet(this,...sets);
    }
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    multSet(...sets:ModSet[]):ModSet{
        return ModSet.multSet(this,...sets);
    }
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static addSet(...sets:ModSet[]):ModSet{
        let add = 0;
        let mult = 1;
        for(let set of sets){
            add += set.add;
            mult += (set.mult-1);
        }
        return new ModSet(add,mult);
    }
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static multSet(...sets:ModSet[]):ModSet{
        let add = 0;
        let mult = 1;
        for(let set of sets){
            add += set.add;
            mult *= set.mult;
        }
        return new ModSet(add,mult);
    }
    toJSON(){
        return {add:this.add,mult:this.mult}
    }
}
/**累加的 对所有属性的调整组表 */
export class ModSetTable implements IJData{
    readonly addTable:Readonly<StaticStatusOption>;
    readonly multTable:Readonly<StaticStatusOption>;
    constructor(addTable?:StaticStatusOption,multTable?:StaticStatusOption){
        this.addTable=addTable||{};
        this.multTable=multTable||{};
    }
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    addSet(...sets:ModSetTable[]):ModSetTable{
        return ModSetTable.addSet(this,...sets);
    }
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    multSet(...sets:ModSetTable[]):ModSetTable{
        return ModSetTable.multSet(this,...sets);
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     */
    getModSet(field:ModifyType):ModSet{
        return new ModSet(this.addTable[field],this.multTable[field]);
    }
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    static addSet(...sets:ModSetTable[]):ModSetTable{
        const outset:ModSetTable = new ModSetTable();
        for(let set of sets)
            ModSetTable.addTableSet(outset,set);
        return outset;
    }
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    static multSet(...sets:ModSetTable[]):ModSetTable{
        const outset:ModSetTable = new ModSetTable();
        for(let set of sets)
            ModSetTable.multTableSet(outset,set);
        return outset;
    }
    private static multTableSet(baseSet: ModSetTable, modSet: ModSetTable) {
        ModSetTable.multMultTable(baseSet.multTable, modSet.multTable);
        ModSetTable.addAddTable(baseSet.addTable, modSet.addTable);
    }
    private static addTableSet(baseSet: ModSetTable, modSet: ModSetTable) {
        ModSetTable.addMultTable(baseSet.multTable, modSet.multTable);
        ModSetTable.addAddTable(baseSet.addTable, modSet.addTable);
    }
    private static addAddTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
        for (let flag of Object.keys(modTable) as ModifyType[]) {
            if (baseTable[flag] == null) baseTable[flag] = 0;
            baseTable[flag]! += modTable[flag]!;
        }
    }
    private static addMultTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
        for (let flag of Object.keys(modTable) as ModifyType[]) {
            if (baseTable[flag] == null) baseTable[flag] = 1;
            baseTable[flag]! += (modTable[flag]!-1);
        }
    }
    private static multMultTable(baseTable: StaticStatusOption, modTable: StaticStatusOption) {
        for (let flag of Object.keys(modTable) as ModifyType[]) {
            if (baseTable[flag] == null) baseTable[flag] = 1;
            baseTable[flag]! *= modTable[flag]!;
        }
    }
    toJSON(){
        return {
            addTable:deepClone(this.addTable),
            multTable:deepClone(this.multTable)
        }
    }
}

