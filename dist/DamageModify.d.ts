import { SkillCategory, SkillRange, SkillType } from "./Skill";
/**伤害类型枚举 */
export declare const DamageTypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
export type DamageType = typeof DamageTypeList[number];
/**伤害包含关系表 */
export declare const DamageIncludeMap: Record<DamageType, DamageType[] | undefined>;
/**伤害特效 */
export declare enum SpecEffact {
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
export declare const 治疗: SpecEffact, 固定: SpecEffact, 稳定: SpecEffact, 穿盾: SpecEffact, 穿防: SpecEffact, 暴击: SpecEffact;
/**伤害特殊效果表 */
export declare const DamageSpecMap: Record<DamageType, SpecEffact[] | undefined>;
/**加成类型 区分乘区*/
export type ModifyType = `${DamageType}伤害` | "技能伤害" | "暴击伤害" | "攻击力" | "所有伤害";
/**伤害类别 */
export declare const DamageCategoryList: readonly ["技能造成的", "非技能造成的"];
export type DamageCategory = typeof DamageCategoryList[number];
/**造成伤害时的修正 */
export type ModifyOnDamage = {
    /**增益数 */
    number: number;
    /**flag */
    modifyType: ModifyType;
    /**约束 */
    constraint: DamageTypeConstraints;
    /**类别 */
    category: "产生的" | "受到的";
};
/**伤害类型约束 */
export type DamageTypeConstraints = {
    /**技能的类型 */
    skillType?: SkillType[];
    /**技能范围 */
    skillRange?: SkillRange[];
    /**技能类别 */
    skillCategory?: SkillCategory[];
    /**伤害类型 */
    type?: DamageType[];
    /**伤害类别 */
    category?: DamageCategory[];
};
