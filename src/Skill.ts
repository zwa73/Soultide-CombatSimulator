import { Attack } from "./Attack";
import { Character } from "./Character";
import { Battlefield } from "./Battlefield";
import { Damage, DamageInfo, DamageType, SpecEffect } from "./Damage";
import { Buff, BuffStack, BuffTable } from "./Modify";
import { AnyTrigger } from "./Trigger";

//———————————————————— 技能 ————————————————————//

/**技能类型 */
const SkillMaintypeList = ["雷电","冰霜","火焰","魔法","物理","非"] as const;
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;

/**技能范围 */
const SkillRangeList = ["单体","群体","无范围"] as const;
export type SkillRange = `${typeof SkillRangeList[number]}技能`;

/**技能子类型 */
const SkillSubtypeList = ["伤害","治疗","辅助","被动"] as const;
export type SkillSubtype = `${typeof SkillSubtypeList[number]}技能`;

/**技能目标 */
export type SkillTarget = "友军"|"我方"|"敌方"|"敌方前排"|"敌方后排";

/**技能类别 */
const SkillCategoryList = ["普攻","核心","秘术","奥义","特性"] as const;
export type SkillCategory = `${typeof SkillCategoryList[number]}技能`;

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
    isTriggerSkill:boolean;
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

/**技能 */
export type Skill={
    /**技能的类型详情 */
    readonly info:SkillInfo;
    /**技能的怒气消耗 默认0*/
    readonly cost?:number;
    /**使用技能
     * @param skillData 技能参数
     */
    readonly cast?:(skillData:SkillData)=>void;
    /**使用技能前的额外效果
     * @param skillData 技能参数
     */
    readonly afterCast?:(skillData:SkillData)=>void;
    /**使用技能后的额外效果
     * @param skillData 技能参数
     */
    readonly beforeCast?:(skillData:SkillData)=>void;
    /**被动Buff 加入技能时会被直接添加 */
    readonly passiveList?:ReadonlyArray<Readonly<BuffStack>>;
    /**触发器 */
    readonly triggerList?:ReadonlyArray<AnyTrigger>;
}

/**生成伤害信息 */
export function genDamageInfo(dmgType:DamageType,info?:SkillInfo):DamageInfo{
    return {
        skillName:info? info.skillName:undefined,
        skillCategory:info? info.skillCategory:undefined,
        skillRange:info? info.skillRange:undefined,
        skillType:info? info.skillType:"非技能",
        skillSubtype:info? info.skillSubtype:undefined,
        dmgType:dmgType,
    }
}
/**产生非技能伤害 */
export function genNonSkillDamage(factor:number,dmgType:DamageType,char?:Character,...specEffects:SpecEffect[]):Damage{
    return new Damage({char:char},factor,genDamageInfo(dmgType),...specEffects);
}
/**产生技能伤害 */
export function genSkillDamage(factor:number,dmgType:DamageType,skillData?:SkillData,...specEffects:SpecEffect[]):Damage{
    return new Damage({
        char:skillData?.user,
        skill:skillData
    },factor,genDamageInfo(dmgType,skillData?.skill.info),...specEffects);
}
/**产生攻击 */
export function genAttack(skillData:SkillData,factor:number,dmgType:DamageType,...specEffects:SpecEffect[]):Attack{
    return new Attack({char:skillData.user,skill:skillData},
        genSkillDamage(factor,dmgType,skillData,...specEffects));
}
/**生成技能信息 */
export function genSkillInfo(skillName:SkillName,skillType:SkillType,skillSubtype:SkillSubtype,skillRange:SkillRange,skillCategory:SkillCategory):SkillInfo{
    return {skillName,skillType,skillSubtype,skillRange,skillCategory};
}
/**检查目标数 如不符合则抛异
 * @param targets 目标
 * @param needMin 最小数量需求 undefine时不限
 * @param needMax 最大数量需求 undefine时不限
 */
export function checkTargets(targets:Character[],needMin?:number,needMax?:number){
    needMax = needMax||Infinity;
    needMin = needMin||0;
    if(targets.length>needMax || targets.length<needMin)
        throw "checkTargets错误 需求目标数: "+needMin+"~"+needMax+" 实际目标数:"+targets.length;
}
