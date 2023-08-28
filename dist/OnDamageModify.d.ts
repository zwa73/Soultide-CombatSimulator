import { DamageInfo, DamageType } from "./Damage";
import { SkillCategory, SkillRange, SkillType } from "./Skill";
export type DamageInfoConstraint = SkillType | SkillRange | SkillCategory | DamageType | "受攻击时";
/**伤害具体类型约束 */
export type DamageInfoConstraintList = Array<DamageInfoConstraint>;
/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
export declare function matchCons(isHurt: boolean, info: DamageInfo, cons: DamageInfoConstraintList): boolean;
