import { Character } from "./Character";
import { Battlefield } from "./Battlefield";
import { BuffStack, BuffTable } from "./Modify";
import { AnyTrigger } from "./Trigger";
/**技能类型 */
declare const SkillMaintypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "其他", "非"];
export type SkillType = `${typeof SkillMaintypeList[number]}技能`;
/**技能范围 */
declare const SkillRangeList: readonly ["单体", "群体", "无范围"];
export type SkillRange = `${typeof SkillRangeList[number]}技能`;
/**技能子类型 */
declare const SkillSubtypeList: readonly ["伤害", "治疗", "辅助", "被动"];
export type SkillSubtype = `${typeof SkillSubtypeList[number]}技能`;
/**技能目标 */
export type SkillTarget = "友军" | "我方" | "敌方" | "敌方前排" | "敌方后排";
/**技能类别 */
declare const SkillCategoryList: readonly ["普攻", "核心", "秘术", "奥义", "特性"];
export type SkillCategory = `${typeof SkillCategoryList[number]}技能`;
/**技能数据 */
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
    isTriggerSkill: boolean;
    /**唯一ID */
    uid: string;
    /**额外的表 */
    dataTable: Record<string, any>;
};
/**可选的技能数据 */
export type SkillDataOption = Partial<SkillData>;
/**技能的详细信息 */
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
/**技能 */
export type Skill = {
    /**技能的类型详情 */
    readonly info: SkillInfo;
    /**技能的怒气消耗 默认0*/
    readonly cost?: number;
    /**使用技能
     * @param skillData 技能参数
     */
    readonly cast?: (skillData: SkillData) => void;
    /**使用技能前的额外效果
     * @param skillData 技能参数
     */
    readonly afterCast?: (skillData: SkillData) => void;
    /**使用技能后的额外效果
     * @param skillData 技能参数
     */
    readonly beforeCast?: (skillData: SkillData) => void;
    /**被动Buff 加入技能时会被直接添加 */
    readonly passiveList?: ReadonlyArray<Readonly<BuffStack>>;
    /**触发器 */
    readonly triggerList?: ReadonlyArray<AnyTrigger>;
};
/**单体技能的技能数据 */
export type STSkillData = {
    target: Character;
} & Omit<SkillData, "targetList">;
/**N目标技能的技能数据 */
export type MTSkillData<T extends number> = {
    targetList: FixedLengthTuple<Character, T>;
} & Omit<SkillData, "targetList">;
/**处理单体技能 process single skill*/
export declare function procSTSkill<T>(skillData: SkillData, func: (skillData: STSkillData) => T): T;
/**N长度 T类型的元组  */
type FixedLengthTuple<T, N extends number, R extends unknown[] = []> = R['length'] extends N ? R : FixedLengthTuple<T, N, [T, ...R]>;
/**处理N个目标的技能 */
export declare function procMTSkill<T, L extends number>(skillData: SkillData, targetCount: L, func: (skillData: MTSkillData<L>) => T): T;
/**生成技能信息 */
export declare function genSkillInfo(skillName: SkillName, skillType: SkillType, skillSubtype: SkillSubtype, skillRange: SkillRange, skillCategory: SkillCategory): SkillInfo;
export {};
