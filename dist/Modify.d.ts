import { AddiDamageType, DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusKey, StaticStatusOption } from "./Status";
import { AnyHook, AnyTigger, HookTiggerMap } from "./Tigger";
/**加成类型 区分乘区 */
export type ModifyType = DamageType | `${SkillCategory}伤害` | AddiDamageType | "技能伤害" | "暴击伤害" | "攻击" | "所有伤害" | "伤害系数";
/**伤害具体类型约束 Damage Info Constraint*/
export type DamageConsType = SkillType | SkillRange | SkillCategory | SkillSubtype | DamageType | "受击时" | "平常时" | SkillName;
/**伤害约束 或 数组或单独的伤害约束组成*/
export type DamageConsOr = ReadonlyArray<DamageConsType> | DamageConsType;
/**伤害约束 与 N个伤害约束或组成*/
export type DamageConsAnd = ReadonlyArray<DamageConsOr>;
/**判断 info 是否包含 target 的所有约束字段
 * cons 如不包含 "受击时" 或 "平常时" 则视为包含 "平常时"
 * @param isHurt 是受到攻击一方的buff 即匹配 "受击时" 约束 否则匹配 "平常时"
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(isHurt?: boolean, info?: DamageInfo, cons?: DamageConsAnd): boolean;
/**累加的调整值表 */
export type ModTableSet = {
    /**倍率调整表 */
    multModTable: StaticStatusOption;
    /**加值调整表 */
    addModTable: StaticStatusOption;
};
export type ModSet = {
    add: number;
    mult: number;
};
/**附加状态 */
export type Buff = {
    /**名称 */
    readonly name: string;
    /**可叠加 重复获得时 层数叠加 默认覆盖*/
    readonly canSatck?: boolean;
    /**叠加上限 可以存在的最大层数 默认无限*/
    readonly stackLimit?: number;
    /**结束时间点 下一次hook触发时结束*/
    readonly endWith?: AnyHook;
    /**倍率增益 */
    readonly multModify?: StaticStatusOption;
    /**叠加的倍率增益 */
    readonly stackMultModify?: StaticStatusOption;
    /**数值增益 */
    readonly addModify?: StaticStatusOption;
    /**叠加的数值增益 */
    readonly stackAddModify?: StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    readonly damageCons?: DamageConsAnd;
    /**触发器 */
    readonly tiggerList?: AnyTigger[];
};
/**叠加的buff */
export type BuffStack = {
    /**buff类型 */
    buff: Buff;
    /**叠加层数 */
    stack: number;
    /**持续时间倒计时 */
    duration: number;
};
/**buff表 */
export declare class BuffTable {
    private _table;
    constructor();
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff: Buff, stack?: number, duration?: number): void;
    /**获取一个Buff的层数 */
    getBuffStack(key: string): number;
    /**获取buff持续时间 */
    getBuffDuration(key: string): number;
    /**是否含有某个有效的buff */
    hasBuff(key: string): boolean;
    /**结算回合 */
    endRound(): void;
    /**移除某个buff */
    removeBuff(key: string): void;
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    modValue(base: number, field: StaticStatusKey, isHurt?: boolean, damageInfo?: DamageInfo): number;
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSet(field: StaticStatusKey, isHurt?: boolean, damageInfo?: DamageInfo): ModSet;
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModTableSet(isHurt?: boolean, damageInfo?: DamageInfo): ModTableSet;
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook: T): HookTiggerMap[T][];
    clone(): BuffTable;
}
/**对ModTableSet进行加运算 乘区加算 加值加算*/
export declare function addModTableSet(...sets: ModTableSet[]): ModTableSet;
/**对ModTableSet进行乘运算 乘区乘算 加值加算*/
export declare function multModTableSet(...sets: ModTableSet[]): ModTableSet;
export declare function addModSet(...sets: ModSet[]): ModSet;
export declare function multModSet(...sets: ModSet[]): ModSet;
export declare const DefModSet: ModSet;
export declare const DefModTableSet: ModTableSet;
