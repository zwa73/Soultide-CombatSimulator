import { DamageInfo, DamageType, DamageTypeList } from "./Damage";
import { SkillCategory, SkillCategoryList, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusKey, StaticStatusOption } from "./Status";
import { AnyHook, AnyTigger, HookTiggerMap } from "./Tigger";

//———————————————————— 调整值 ————————————————————//


/**加成类型 区分乘区 */
export type ModifyType = `${DamageType}伤害`|`${SkillCategory}伤害`|`${DamageType}附伤`|"技能伤害"|"暴击伤害"|"攻击"|"所有伤害"|"伤害系数";
/**所有可能的加成类型枚举 */
export const ModifyTypeList:ModifyType[]=[];
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}附伤`));
SkillCategoryList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
ModifyTypeList.push("技能伤害","暴击伤害","攻击","所有伤害","伤害系数");


/**伤害具体类型约束 */
export type DamageInfoConstraint=SkillType|SkillRange|SkillCategory|SkillSubtype|DamageType|"受攻击时"|SkillName;
/**伤害约束表 */
export type DamageInfoConstraintList=ReadonlyArray<DamageInfoConstraint>


/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
export function matchCons(isHurt:boolean,info:DamageInfo,cons:DamageInfoConstraintList){
    let infos:DamageInfoConstraint[]=[];
    Object.values(info).forEach(element => infos.push(element));
    if(isHurt) infos.push("受攻击时");
    //遍历约束
    for(let con of cons)
        if(!infos.includes(con)) return false;
    return true;
}


/**累加的调整值表 */
export type ModTableSet = {
    /**倍率调整表 */
    multModTable:StaticStatusOption,
    /**加值调整表 */
    addModTable:StaticStatusOption,
}

/**附加状态 */
export type Buff={
    /**名称 */
    readonly name:string;
    /**可叠加 */
    readonly canSatck?:boolean;
    /**结束时间点 数字为经过回合数 hook字段为下一次hook触发时 默认则不结束*/
    readonly endWith?:number|AnyHook;
    /**倍率增益 */
    readonly multModify?:StaticStatusOption;
    /**叠加的倍率增益 */
    readonly stackMultModify?:StaticStatusOption;
    /**数值增益 */
    readonly addModify?:StaticStatusOption;
    /**叠加的数值增益 */
    readonly stackAddModify?:StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    readonly damageConstraint?:DamageInfoConstraintList;
    /**触发器 */
    readonly tiggerList?:AnyTigger[];
}
/**叠加的buff */
export type StackBuff={
    /**buff类型 */
    buff:Buff,
    /**叠加层数 */
    stack:number,
}
/**buff表 */
export class BuffTable{
    private _table:Record<string,StackBuff>={};
    constructor(){}
    /**添加一个Buff */
    addBuff(buff:Buff,stack:number){
        if(this._table[buff.name]==null || buff.canSatck!=true)
            this._table[buff.name]={buff,stack};
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
    /**是否含有某个有效的buff */
    hasBuff(key:string):boolean{
        return this.getBuffStack(key)>0;
    }
    /**移除某个buff */
    removeBuff(key:string){
        this._table[key].stack=0;
    }
    /**获取某个计算完增益的属性 不包含伤害约束属性
     * @param base  基础值
     * @param field 所要应用的调整字段
     */
    getStaticStatus(base:number,field:StaticStatusKey):number{
        let mult = 1;
        let add  = 0;
        for(let buffName in this._table){
            let stackData = this._table[buffName];
            let buff = stackData.buff;
            let stack = stackData.stack;

            if(buff.damageConstraint!=null) continue;

            if(buff.multModify)
                mult += buff.multModify[field]||0;
            if(buff.stackMultModify)
                mult += stack * (buff.stackMultModify[field]||0);

            if(buff.addModify)
                add += buff.addModify[field]||0;
            if(buff.stackAddModify)
                add += stack * (buff.stackAddModify[field]||0);
        }
        return (base+add)*mult;
    }
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getDamageConsModTable(isHurt:boolean,damageInfo:DamageInfo):ModTableSet{
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item=>
                item.buff.damageConstraint &&
                matchCons(isHurt,damageInfo,item.buff.damageConstraint));

        const multModTable:StaticStatusOption={} as any;
        const addModTable :StaticStatusOption={} as any;
        //叠加乘区
        function stackArean(baseMap:StaticStatusOption,modMap:StaticStatusOption,stack:number){
            for(let flag of Object.keys(modMap) as StaticStatusKey[]){
                if(baseMap[flag]==null) baseMap[flag]=1;
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
            stackArean(multModTable, basedMultTable, 1      );
            stackArean(multModTable, stackMultTable, stack  );
            stackArean(addModTable , basedAddTable , 1      );
            stackArean(addModTable , stackAddTable , stack  );
        }
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