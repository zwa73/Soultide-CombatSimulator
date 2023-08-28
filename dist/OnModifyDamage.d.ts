import { DamageType } from "./Damage";
import { SkillCategory, SkillRange, SkillType } from "./Skill";
/**加成类型 区分乘区*/
export type ModifyType = `${DamageType}伤害` | "技能伤害" | "暴击伤害" | "攻击力" | "所有伤害";
/**伤害类别 */
export type DamageCategory = `${SkillType}${SkillRange | ""}技能造成的` | "非技能造成的";
/**造成伤害时的修正 */
export type OnDamageModify = {
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
/**判断target是否完全包含base */
export declare function testConstraints(base: DamageTypeConstraints, target: DamageTypeConstraints): boolean;
