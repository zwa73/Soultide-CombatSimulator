import { Attack } from "./Attack";
import { Character } from "./Character";
import { Battlefield } from "./CombatSimulation";
import { Damage, DamageInfo, DamageType, SpecEffect } from "./Damage";
import { BuffTable } from "./Modify";
/**技能类型 */
declare const SkillMaintypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "非"];
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;
/**技能范围 */
declare const SkillRangeList: readonly ["单体", "群体", "无范围"];
export type SkillRange = `${typeof SkillRangeList[number]}技能`;
/**技能子类型 */
declare const SkillSubtypeList: readonly ["伤害", "治疗", "辅助"];
export type SkillSubtype = `${typeof SkillSubtypeList[number]}技能`;
/**技能目标 */
export type SkillTarget = "友军" | "我方" | "敌方" | "敌方前排" | "敌方后排";
/**技能类别 */
declare const SkillCategoryList: readonly ["普攻", "核心", "秘术", "奥义", "其他"];
export type SkillCategory = `${typeof SkillCategoryList[number]}技能`;
export type SkillData = {
    skill: Skill;
    /**战场 */
    battlefield: Battlefield;
    /**使用者 */
    user: Character;
    /**目标 */
    targetList: Character[];
    /**只应用于此次技能的Buff */
    buffTable: BuffTable;
    /**是触发的技能 */
    isTiggerSkill: boolean;
    /**唯一ID */
    uid: string;
    /**额外的表 */
    dataTable: Record<string, any>;
};
export type SkillInfo = {
    /**技能名 */
    readonly skillName: SkillName;
    /**技能的类型 */
    readonly skillType: SkillType;
    /**技能的子类型 */
    readonly skillSubtype: SkillSubtype;
    /**技能范围 */
    readonly skillRange: SkillRange;
    /**技能类别 */
    readonly skillCategory: SkillCategory;
};
/**技能名 */
export type SkillName = `技能:${string}`;
/**能 */
export type Skill = {
    /**技能的类型详情 */
    readonly info: SkillInfo;
    /**技能的怒气消耗 */
    readonly cost: number;
    /**使用技能
     * @param skillData 技能参数
     */
    readonly cast: (skillData: SkillData) => void;
    /**使用技能前的额外效果
     * @param skillData 技能参数
     */
    readonly afterCast?: (skillData: SkillData) => void;
    /**使用技能后的额外效果
     * @param skillData 技能参数
     */
    readonly beforeCast?: (skillData: SkillData) => void;
};
export declare function genDamageInfo(info: SkillInfo, dmgType: DamageType): DamageInfo;
export declare function genDamage(skill: Skill, skillData: SkillData, factor: number, dmgType: DamageType, ...specEffects: SpecEffect[]): Damage;
export declare function genAttack(skill: Skill, skillData: SkillData, factor: number, dmgType: DamageType, ...specEffects: SpecEffect[]): Attack;
export declare function genSkillInfo(skillName: SkillName, skillType: SkillType, skillSubtype: SkillSubtype, skillRange: SkillRange, skillCategory: SkillCategory): SkillInfo;
export declare function checkTargets(targets: Character[], needMin: number, needMax: number): void;
export {};
