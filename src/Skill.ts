import { Attack } from "./Attack";
import { Battlefield, Character } from "./CombatSimulation";
import { Damage, DamageInfo, DamageType, SpecEffect } from "./Damage";

//———————————————————— 技能 ————————————————————//



/**技能类型 */
export const SkillMaintypeList = ["雷电","冰霜","火焰","魔法","物理","非"] as const;
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;

/**技能范围 */
export const SkillRangeList = ["单体","群体","无范围"] as const;
export type SkillRange = typeof SkillRangeList[number];

/**技能目标 */
export type SkillTarget = "友军"|"我方"|"敌方"|"敌方前排"|"敌方后排";

/**技能类别 */
export const SkillCategoryList = ["普攻","核心","秘术","奥义","无类别"] as const;
export type SkillCategory = typeof SkillCategoryList[number];

export type SkillData={
    /**战场 */
    battlefield:Battlefield,
    /**使用者 */
    user:Character,
    /**目标 */
    target:Character[]
}
export type SkillInfo={
    /**技能的类型 */
    type:SkillType;
    /**技能范围 */
    range:SkillRange;
    /**技能类别 */
    category:SkillCategory;
}
export type Skill={
    info:SkillInfo;
    /**使用技能
     * @param skillData 技能参数
     */
    use(skillData:SkillData):void;
}
export function genDamageInfo(info:SkillInfo,dmgType:DamageType):DamageInfo{
    return {
        skillCategory:info.category,
        skillRange:info.range,
        skillType:info.type,
        dmgType:dmgType,
    }
}
export function genDamage(info:SkillInfo,skillData:SkillData,factor:number,dmgType:DamageType,...specEffects:SpecEffect[]):Damage{
    return new Damage(skillData.user,factor,genDamageInfo(info,dmgType),...specEffects);
}
export function genAttack(info:SkillInfo,skillData:SkillData,factor:number,dmgType:DamageType,...specEffects:SpecEffect[]):Attack{
    return new Attack(skillData.user,genDamage(info,skillData,factor,dmgType,...specEffects));
}
export function genSkillInfo(type:SkillType,range:SkillRange,category:SkillCategory):SkillInfo{
    return {type,range,category};
}
