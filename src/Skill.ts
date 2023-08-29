import { Attack } from "./Attack";
import { Character } from "./Character";
import { Battlefield } from "./CombatSimulation";
import { Damage, DamageInfo, DamageType, SpecEffect } from "./Damage";
import { BuffTable } from "./Modify";

//———————————————————— 技能 ————————————————————//

/**技能类型 */
const SkillMaintypeList = ["雷电","冰霜","火焰","魔法","物理","非"] as const;
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;

/**技能范围 */
const SkillRangeList = ["单体","群体","无范围"] as const;
export type SkillRange = typeof SkillRangeList[number];

/**技能子类型 */
const SkillSubtypeList = ["伤害技能","治疗技能","其他技能"] as const;
export type SkillSubtype = typeof SkillSubtypeList[number];

/**技能目标 */
export type SkillTarget = "友军"|"我方"|"敌方"|"敌方前排"|"敌方后排";

/**技能类别 */
const SkillCategoryList = ["普攻","核心","秘术","奥义","无类别"] as const;
export type SkillCategory = typeof SkillCategoryList[number];

export type SkillData={
    skill:Skill;
    /**战场 */
    battlefield:Battlefield;
    /**使用者 */
    user:Character;
    /**目标 */
    targetList:Character[];
    /**只应用于此次技能的Buff */
    buffTable:BuffTable;
    /**是触发的技能 */
    isTiggerSkill:boolean;
    /**唯一ID */
    uid:string;
    /**额外的表 */
    dataTable:Record<string,any>;
}
export type SkillInfo={
    /**技能名 */
    readonly skillName:SkillName;
    /**技能的类型 */
    readonly skillType:SkillType;
    /**技能的子类型 */
    readonly skillSubtype:SkillSubtype;
    /**技能范围 */
    readonly skillRange:SkillRange;
    /**技能类别 */
    readonly skillCategory:SkillCategory;
}
/**技能名 */
export type SkillName = `技能:${string}`;

/**能 */
export type Skill={
    /**技能的类型详情 */
    readonly info:SkillInfo;
    /**技能的怒气消耗 */
    readonly cost:number;
    /**使用技能
     * @param skillData 技能参数
     */
    readonly cast:(skillData:SkillData)=>void;
    /**使用技能前的额外效果
     * @param skillData 技能参数
     */
    readonly afterCast?:(skillData:SkillData)=>void;
    /**使用技能后的额外效果
     * @param skillData 技能参数
     */
    readonly beforeCast?:(skillData:SkillData)=>void;
}
export function genDamageInfo(info:SkillInfo,dmgType:DamageType):DamageInfo{
    return {
        skillName:info.skillName,
        skillCategory:info.skillCategory,
        skillRange:info.skillRange,
        skillType:info.skillType,
        skillSubtype:info.skillSubtype,
        dmgType:dmgType,
    }
}
export function genDamage(skill:Skill,skillData:SkillData,factor:number,dmgType:DamageType,...specEffects:SpecEffect[]):Damage{
    return new Damage({char:skillData.user,skill:skillData},factor,genDamageInfo(skill.info,dmgType),...specEffects);
}
export function genAttack(skill:Skill,skillData:SkillData,factor:number,dmgType:DamageType,...specEffects:SpecEffect[]):Attack{
    return new Attack({char:skillData.user,skill:skillData},genDamage(skill,skillData,factor,dmgType,...specEffects));
}
export function genSkillInfo(skillName:SkillName,skillType:SkillType,skillSubtype:SkillSubtype,skillRange:SkillRange,skillCategory:SkillCategory):SkillInfo{
    return {skillName,skillType,skillSubtype,skillRange,skillCategory};
}
export function checkTargets(targets:Character[],needMin:number,needMax:number){
    if(targets.length>needMax || targets.length<needMin)
        throw "checkTargets错误 需求目标数:"+needMin+"~"+needMax+" 实际目标数:"+targets.length;
}
