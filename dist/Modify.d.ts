import { AddiDamageType, DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusOption } from "./Status";
import { AnyHook, AnyTrigger, HookTriggerMap } from "./Trigger";
type ModiftTypeBase = "最大生命" | "速度" | "防御" | "初始怒气" | "闪避" | "最大怒气" | "怒气回复";
type ModifyTypeAtk = DamageType | `${SkillCategory}伤害` | `${SkillRange}伤害` | AddiDamageType | "技能伤害" | "攻击" | "暴击率" | "暴击伤害" | "所有伤害" | "伤害系数" | "穿透防御";
/**加成类型 区分乘区 */
export type ModifyType = ModifyTypeAtk | `受到${ModifyTypeAtk}` | ModiftTypeBase;
/**伤害具体类型约束 Damage Info Constraint*/
export type DamageConsType = SkillType | SkillRange | SkillCategory | SkillSubtype | DamageType | SkillName;
/**伤害约束 或 数组或单独的伤害约束组成*/
export type DamageConsOr = ReadonlyArray<DamageConsType> | DamageConsType;
/**伤害约束 与 N个伤害约束或组成*/
export type DamageConsAnd = ReadonlyArray<DamageConsOr>;
/**判断 info 是否包含 target 的所有约束字段
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(info?: DamageInfo, cons?: DamageConsAnd): boolean;
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
export type BuffType = "正面效果" | "负面效果" | "控制效果" | "其他效果";
/**buff的详细信息 */
export type BuffInfo = {
    readonly buffName: BuffName;
    readonly buffType: BuffType;
};
export declare function genBuffInfo(buffName: BuffName, buffType: BuffType): BuffInfo;
/**附加效果 */
export type Buff = {
    /**名称 */
    readonly info: BuffInfo;
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
    readonly triggerList?: AnyTrigger[];
};
export type BuffName = `效果:${string}`;
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
    /**获取一个Buff的层数 不会触发触发器
     * @deprecated 这个函数仅供Character.getBuffStackCountWithoutT 或内部调用
     */
    getBuffStackCountWithoutT(buff: Buff): number;
    /**获取一个Buff
     * @deprecated 这个函数仅供Character.getBaseStatus调用
     */
    getBuff(key: BuffName): Buff | undefined;
    /**获取buff持续时间 */
    getBuffDuration(buff: Buff): number;
    /**是否含有某个有效的buff */
    hasBuff(buff: Buff): boolean;
    /**检查buff是否有效 无效则移除*/
    private checkBuff;
    /**结算回合 */
    endRound(): void;
    /**移除某个buff */
    removeBuff(buff: Buff): void;
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    modValue(base: number, field: ModifyType, damageInfo?: DamageInfo): number;
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSet(field: ModifyType, damageInfo?: DamageInfo): ModSet;
    /**获取伤害约束的Buff调整值表 不会触发触发器
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModTableSet(damageInfo?: DamageInfo): ModTableSet;
    /**获取buffTable中所有对应触发器 不包括全局触发器*/
    getTiggers<T extends AnyHook>(hook: T): HookTriggerMap[T][];
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
export {};
