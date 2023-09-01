import { IJData } from "@zwa73/utils";
import { AddiDamageType, Damage, DamageType } from "./Damage";
import { SkillCategory, SkillName, SkillRange, SkillSubtype, SkillType } from "./Skill";
import { StaticStatusOption } from "./Status";
import { AnyHook, AnyTrigger, HookTriggerMap } from "./Trigger";
import { Character } from "./Character";
type ModiftTypeBase = "最大生命" | "速度" | "防御" | "初始怒气" | "闪避" | "最大怒气" | "怒气回复";
type ModifyTypeAtk = DamageType | `${SkillCategory}伤害` | `${SkillRange}伤害` | AddiDamageType | "技能伤害" | "攻击" | "暴击率" | "暴击伤害" | "所有伤害" | "伤害系数" | "穿透防御";
/**加成类型 区分乘区 */
export type ModifyType = ModifyTypeAtk | `受到${ModifyTypeAtk}` | ModiftTypeBase;
/**伤害具体类型约束 Damage Info Constraint*/
export type DamageConsType = SkillType | SkillRange | SkillCategory | SkillSubtype | DamageType | SkillName | "鸣响技能";
/**伤害约束 或 数组或单独的伤害约束组成*/
export type DamageConsOr = ReadonlyArray<DamageConsType> | DamageConsType;
/**伤害约束 与 N个伤害约束或组成*/
export type DamageConsAnd = ReadonlyArray<DamageConsOr>;
/**判断 info 是否包含 target 的所有约束字段
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(dmg?: Damage, cons?: DamageConsAnd): boolean;
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
    /**倍率增益 从0起算 +25%为0.25*/
    readonly multModify?: StaticStatusOption;
    /**叠加的倍率增益 从0起算 +25%为0.25*/
    readonly stackMultModify?: StaticStatusOption;
    /**数值增益 */
    readonly addModify?: StaticStatusOption;
    /**叠加的数值增益 */
    readonly stackAddModify?: StaticStatusOption;
    /**特殊的数值增益 */
    readonly specialModify?: (table: BuffTable) => {
        /**数值增益 */
        addModify?: StaticStatusOption;
        /**倍率增益 从0起算 +25%为0.25*/
        multModify?: StaticStatusOption;
    };
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
    /**额外的表 */
    dataTable?: Record<string, any>;
};
/**buff表 */
export declare class BuffTable {
    /**buff表附着于哪个角色 */
    attacherChar: Character;
    private _table;
    /**
     * @param attacherChar buff表附着于哪个角色
     */
    constructor(attacherChar: Character);
    /**添加一个buff
     * @deprecated 这个函数仅供Character.addBuff 或内部调用
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff: Buff, stack?: number, duration?: number): void;
    /**获取一个Buff的层数 不会触发触发器
     * @deprecated 这个函数仅供Character.getBuffStackCountWithoutT 或内部调用
     */
    getBuffStackCount(buff: Buff): number;
    /**获取一个Buff
     * @deprecated 这个函数仅供Character.getBaseStatus调用
     */
    getBuff(key: BuffName): Buff | undefined;
    /**获取buff持续时间 */
    getBuffDuration(buff: Buff): number;
    /**获取BuffStack */
    getBuffStack(buff: Buff): BuffStack | undefined;
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
     * @param damage     伤害
     */
    modValue(base: number, field: ModifyType, damage?: Damage): number;
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param damage     伤害
     */
    getModSet(field: ModifyType, damage?: Damage): ModSet;
    /**获取伤害约束的Buff调整值表 不会触发触发器
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSetTable(damage?: Damage): ModSetTable;
    /**获取buffTable中所有对应触发器 不包括全局触发器
     * @deprecated 这个函数仅供Character.getTiggers 或内部调用
     */
    getTriggers<T extends AnyHook>(hook: T): HookTriggerMap[T][];
    clone(): BuffTable;
}
/**对某个属性的调整组 */
export declare class ModSet implements IJData {
    readonly add: number;
    readonly mult: number;
    constructor(add?: number, mult?: number);
    /**对某个值进行增益 */
    modValue(base: number): number;
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    addSet(...sets: ModSet[]): ModSet;
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    multSet(...sets: ModSet[]): ModSet;
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static addSet(...sets: ModSet[]): ModSet;
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static multSet(...sets: ModSet[]): ModSet;
    toJSON(): {
        add: number;
        mult: number;
    };
}
/**累加的 对所有属性的调整组表 */
export declare class ModSetTable implements IJData {
    /**加值增益表 */
    readonly addTable: Readonly<StaticStatusOption>;
    /**倍率增益表 从1起算 +25%为1.25*/
    readonly multTable: Readonly<StaticStatusOption>;
    constructor(addTable?: StaticStatusOption, multTable?: StaticStatusOption);
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    addSet(...sets: ModSetTable[]): ModSetTable;
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    multSet(...sets: ModSetTable[]): ModSetTable;
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     */
    getModSet(field: ModifyType): ModSet;
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    static addSet(...sets: ModSetTable[]): ModSetTable;
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    static multSet(...sets: ModSetTable[]): ModSetTable;
    private static multTableSet;
    private static addTableSet;
    private static addAddTable;
    private static addMultTable;
    private static multMultTable;
    toJSON(): {
        addTable: Readonly<Partial<import("./Status").StaticStatus>>;
        multTable: Readonly<Partial<import("./Status").StaticStatus>>;
    };
}
export {};
