import { DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillRange, SkillType } from "./Skill";
/**加成类型 区分乘区*/
export type ModifyType = `${DamageType}伤害` | `${SkillCategory}伤害` | `${DamageType}附伤` | "技能伤害" | "暴击伤害" | "攻击力" | "所有伤害" | "伤害系数";
/**造成伤害时的修正 */
export type OnDamageModify = {
    /**增益数 */
    number: number;
    /**flag */
    modifyType: ModifyType;
    /**类别 */
    isHurtMod?: true;
    /**约束 */
    constraint: DamageInfoConstraints;
};
/**伤害具体类型约束 */
export type DamageInfoConstraints = Array<SkillType | SkillRange | SkillCategory | DamageType>;
/**判断target是否完全包含base */
export declare function testConstraints(base: DamageInfo, target: DamageInfoConstraints): boolean;
