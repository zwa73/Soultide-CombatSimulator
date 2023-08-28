import { DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillRange, SkillType } from "./Skill";
/**加成类型 区分乘区*/
export type ModifyType = `${DamageType}伤害` | `${SkillCategory}伤害` | `${DamageType}附伤` | "技能伤害" | "暴击伤害" | "攻击" | "所有伤害" | "伤害系数";
export declare const ModifyTypeList: ModifyType[];
export type DamageInfoConstraint = SkillType | SkillRange | SkillCategory | DamageType | "受攻击时";
/**伤害具体类型约束 */
export type DamageInfoConstraintList = Array<DamageInfoConstraint>;
/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(isHurt: boolean, info: DamageInfo, cons: DamageInfoConstraintList): boolean;
