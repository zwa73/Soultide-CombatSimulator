import { Attack } from "./Attack";
import { Battlefield, Character } from "./CombatSimulation";
import { Damage, DamageInfo, DamageType, SpecEffect } from "./Damage";
/**技能类型 */
export declare const SkillMaintypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "非"];
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;
/**技能范围 */
export declare const SkillRangeList: readonly ["单体", "群体", "无范围"];
export type SkillRange = typeof SkillRangeList[number];
/**技能目标 */
export type SkillTarget = "友军" | "我方" | "敌方" | "敌方前排" | "敌方后排";
/**技能类别 */
export declare const SkillCategoryList: readonly ["普攻", "核心", "秘术", "奥义", "无类别"];
export type SkillCategory = typeof SkillCategoryList[number];
export type SkillData = {
    /**战场 */
    battlefield: Battlefield;
    /**使用者 */
    user: Character;
    /**目标 */
    target: Character[];
};
export type SkillInfo = {
    /**技能的类型 */
    type: SkillType;
    /**技能范围 */
    range: SkillRange;
    /**技能类别 */
    category: SkillCategory;
};
export type Skill = {
    info: SkillInfo;
    /**使用技能
     * @param skillData 技能参数
     */
    use(skillData: SkillData): void;
};
export declare function genDamageInfo(info: SkillInfo, dmgType: DamageType): DamageInfo;
export declare function genDamage(info: SkillInfo, skillData: SkillData, factor: number, dmgType: DamageType, ...specEffects: SpecEffect[]): Damage;
export declare function genAttack(info: SkillInfo, skillData: SkillData, factor: number, dmgType: DamageType, ...specEffects: SpecEffect[]): Attack;
export declare function genSkillInfo(type: SkillType, range: SkillRange, category: SkillCategory): SkillInfo;
