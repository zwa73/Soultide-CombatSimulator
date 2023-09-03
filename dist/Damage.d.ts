import { Attack, AttackSource } from "./Attack";
import { Writeable } from "@zwa73/utils";
import { Character } from "./Character";
import { SkillData, SkillInfo } from "./Skill";
/**伤害类别 */
export type DamageCategory = "所有伤害" | "治疗效果" | "护盾效果";
/**伤害类型枚举 */
declare const DamageBaseTypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "电击", "极寒", "燃烧", "暗蚀", "流血", "固定"];
/**伤害类型 */
export type DamageType = `${typeof DamageBaseTypeList[number]}伤害`;
/**附伤类型 additional damage */
export type AddiDamageType = `${typeof DamageBaseTypeList[number]}附伤`;
declare const SpecEffectList: readonly ["固定", "稳定", "穿盾", "穿防", "暴击", "鸣响", "不击破"];
/**伤害特效 */
export type SpecEffect = `${typeof SpecEffectList[number]}特效`;
/**伤害类型详情 非技能来源时 skillType 为 非技能 其他undefine*/
export type DamageInfo = {
    /**伤害类别 */
    dmgCategory: DamageCategory;
    /**伤害类型 */
    dmgType: DamageType;
} & Omit<Partial<Writeable<SkillInfo>>, "skillType"> & Pick<Writeable<SkillInfo>, "skillType">;
/**伤害来源 */
export type DamageSource = {
    /**攻击来源 */
    attack?: Attack;
} & Partial<AttackSource>;
/**伤害 */
export declare class Damage {
    /**伤害详细类型 */
    info: DamageInfo;
    /**系数 */
    factor: number;
    /**特效 */
    specEffects: SpecEffect[];
    /**来源 */
    source: DamageSource;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param specEffects 特殊效果
     */
    constructor(source: DamageSource, factor: number, info: DamageInfo, ...specEffects: SpecEffect[]);
    /**计算攻击时 来源的 应用的加值与倍率
     * @returns [ multModMap, addModMap ]
     */
    private calcSourceModSetTable;
    /**含有任何一个特效 */
    hasSpecEffect(...flags: SpecEffect[]): boolean;
    /**获取所有特效 */
    getSpecEffectList(): SpecEffect[];
    /**计算伤害 */
    calcOverdamage(target: Character): number;
    /**计算治疗或护盾 */
    calcOverHeal(target: Character): number;
    /**是技能伤害 */
    isSkillDamage(): boolean;
    /**复制一份伤害 */
    clone(): Damage;
}
/**生成伤害信息 */
export declare function genDamageInfo(dmgType: DamageType, dmgCategory: DamageCategory, info?: SkillInfo): DamageInfo;
/**产生非技能伤害 */
export declare function genNonSkillDamage(factor: number, dmgType: DamageType, dmgCategory: DamageCategory, char?: Character, ...specEffects: SpecEffect[]): Damage;
/**产生技能伤害 */
export declare function genSkillDamage(factor: number, dmgType: DamageType, dmgCategory: DamageCategory, skillData?: SkillData, ...specEffects: SpecEffect[]): Damage;
export {};
