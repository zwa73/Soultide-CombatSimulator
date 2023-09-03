import { Attack } from "./Attack";
import { Character } from "./Character";
import { Battlefield } from "./Battlefield";
import { Damage, DamageInfo, DamageType, SpecEffect, genSkillDamage } from "./Damage";
import { Buff, BuffStack, BuffTable } from "./Modify";
import { AnyTrigger } from "./Trigger";

//———————————————————— 技能 ————————————————————//

/**技能类型 */
const SkillMaintypeList = ["雷电","冰霜","火焰","魔法","物理","无类型"] as const;
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
const SkillCategoryList = ["普攻","核心","秘术","奥义","特性","无类别"] as const;
export type SkillCategory = `${typeof SkillCategoryList[number]}技能`;

/**技能数据 */
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
}
/**可选的技能数据 */
export type SkillDataOption = Partial<SkillData>;
/**技能的详细信息 */
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
    /**不会自动结束的技能 */
    readonly willNotEnd?:boolean;
    /**使用技能
     * @param skillData 技能参数
     */
    readonly cast?:(skillData:SkillData)=>void;
    /**被动Buff 角色加入技能时会被直接添加 */
    readonly passiveList?:ReadonlyArray<Readonly<BuffStack>>;
    /**触发器 加入角色就会获得的 */
    readonly triggerList?:ReadonlyArray<AnyTrigger>;
}

/**单体技能的技能数据 */
export type STSkillData = {
    target:Character
}&Omit<SkillData,"targetList">;

/**N目标技能的技能数据 */
export type MTSkillData<T extends number> = {
    targetList:FixedLengthTuple<Character,T>
}&Omit<SkillData,"targetList">;

/**处理单体技能 process single skill*/
export function procSTSkill<T>(skillData:SkillData,func:(skillData:STSkillData)=>T):T{
    checkTargets(skillData.targetList,1,1);
    const { targetList, ...rest } = skillData;
    const single:STSkillData={
        ...rest,
        target:skillData.targetList[0]
    }
    return func(single);
}


/**N长度 T类型的元组  */
type FixedLengthTuple<T, N extends number, R extends unknown[] = []> =
    R['length'] extends N ? R : FixedLengthTuple<T, N, [T, ...R]>;




/**处理N个目标的技能 */
export function procMTSkill<T,L extends number>
    (skillData:SkillData,targetCount:L,func:(skillData:MTSkillData<L>)=>T):T{
    checkTargets(skillData.targetList,targetCount,targetCount);
    const { targetList, ...rest } = skillData;
    const fixedList:FixedLengthTuple<Character,L>=targetList as any;

    const data:MTSkillData<L>={
        ...rest,
        targetList:fixedList
    }
    return func(data);
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
function checkTargets(targets:Character[],needMin?:number,needMax?:number){
    needMax = needMax||Infinity;
    needMin = needMin||0;
    if(targets.length>needMax || targets.length<needMin)
        throw "checkTargets错误 需求目标数: "+needMin+"~"+needMax+" 实际目标数:"+targets.length;
}
