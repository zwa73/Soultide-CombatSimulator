import { DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillRange, SkillType } from "./Skill";
import { StaticStatusKey, StaticStatusOption } from "./Status";
import { AnyHook, AnyTigger, HookTiggerMap } from "./Tigger";
/**加成类型 区分乘区 */
export type ModifyType = `${DamageType}伤害` | `${SkillCategory}伤害` | `${DamageType}附伤` | "技能伤害" | "暴击伤害" | "攻击" | "所有伤害" | "伤害系数";
/**所有可能的加成类型枚举 */
export declare const ModifyTypeList: ModifyType[];
/**伤害具体类型约束 */
export type DamageInfoConstraint = SkillType | SkillRange | SkillCategory | DamageType | "受攻击时";
/**伤害约束表 */
export type DamageInfoConstraintList = ReadonlyArray<DamageInfoConstraint>;
/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(isHurt: boolean, info: DamageInfo, cons: DamageInfoConstraintList): boolean;
/**累加的调整值表 */
export type ModTableSet = {
    /**倍率调整表 */
    multModTable: StaticStatusOption;
    /**加值调整表 */
    addModTable: StaticStatusOption;
};
/**附加状态 */
export type Buff = {
    /**名称 */
    readonly name: string;
    /**可叠加 */
    readonly canSatck?: boolean;
    /**结束时间点 数字为经过回合数 hook字段为下一次hook触发时 默认则不结束*/
    readonly endWith?: number | AnyHook;
    /**倍率增益 */
    readonly multModify?: StaticStatusOption;
    /**叠加的倍率增益 */
    readonly stackMultModify?: StaticStatusOption;
    /**数值增益 */
    readonly addModify?: StaticStatusOption;
    /**叠加的数值增益 */
    readonly stackAddModify?: StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    readonly damageConstraint?: DamageInfoConstraintList;
    /**触发器 */
    readonly tiggerList?: AnyTigger[];
};
/**叠加的buff */
export type StackBuff = {
    /**buff类型 */
    buff: Buff;
    /**叠加层数 */
    stack: number;
};
/**buff表 */
export declare class BuffTable {
    private _table;
    constructor();
    /**添加一个Buff */
    addBuff(buff: Buff, stack: number): void;
    /**获取一个Buff的层数 */
    getBuffStack(key: string): number;
    /**获取某个计算完增益的属性 不包含伤害约束属性
     * @param base  基础值
     * @param field 所要应用的调整字段
     */
    getStaticStatus(base: number, field: StaticStatusKey): number;
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getDamageConsModTable(isHurt: boolean, damageInfo: DamageInfo): ModTableSet;
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook: T): HookTiggerMap[T][];
    clone(): BuffTable;
}
