import { Character } from "./CombatSimulation";
import { SkillCategory, SkillType, SkillRange } from "./Skill";
/**伤害类型枚举 */
export declare const DamageTypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
export type DamageType = `${typeof DamageTypeList[number]}`;
/**伤害包含关系表 */
export declare const DamageIncludeMap: Record<DamageType, DamageType[] | undefined>;
/**伤害特效 */
export declare enum SpecEffect {
    /**造成治疗 */
    治疗 = "\u6CBB\u7597",
    /**不享受任何加成 造成相当于系数的伤害 */
    固定 = "\u56FA\u5B9A",
    /**不会浮动 */
    稳定 = "\u7A33\u5B9A",
    /**穿透护盾 */
    穿盾 = "\u7A7F\u76FE",
    /**忽视防御 */
    穿防 = "\u7A7F\u9632",
    /**暴击伤害 */
    暴击 = "\u66B4\u51FB"
}
export declare const 治疗: SpecEffect, 固定: SpecEffect, 稳定: SpecEffect, 穿盾: SpecEffect, 穿防: SpecEffect, 暴击: SpecEffect;
/**伤害特殊效果表 */
export declare const DamageSpecMap: Record<DamageType, SpecEffect[] | undefined>;
/**伤害具体类型 */
export type DamageInfo = {
    /**技能的类型 */
    skillType: SkillType;
    /**技能范围 */
    skillRange: SkillRange;
    /**技能类别 */
    skillCategory: SkillCategory;
    /**伤害类型 */
    dmgType: DamageType;
};
/**伤害 */
export declare class Damage {
    /**伤害详细类型 */
    info: DamageInfo;
    /**系数 */
    factor: number;
    /**特效 */
    specEffects: SpecEffect[];
    /**来源 */
    source: Character;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param category    伤害类别
     * @param specEffects 特殊效果
     */
    constructor(source: Character, factor: number, info: DamageInfo, ...specEffects: SpecEffect[]);
    /**含有某个特效 */
    hasSpecEffect(flag: SpecEffect): boolean | undefined;
    /**计算伤害 */
    calcOverdamage(target: Character): number;
    /**复制一份伤害 */
    clone(): Damage;
}
