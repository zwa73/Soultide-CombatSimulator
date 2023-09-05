import { Writeable, JObject } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield } from "./Battlefield";
import { Damage } from "./Damage";
import { Buff, BuffTable } from "./Modify";
import { Skill, SkillData, SkillDataOption } from "./Skill";
import { DynmaicStatus, StaticStatusOption } from "./Status";
import { TRoundEndBefore } from "./Trigger";
/**角色 */
export declare class Character {
    /**角色名称 */
    name: string;
    /**角色处在的战场 */
    battlefield: Battlefield;
    /**角色的当前属性 */
    dynmaicStatus: DynmaicStatus;
    /**所有的附加状态
     * @deprecated 这个成员仅供伤害攻击计算系统或内部调用
     * 对角色操作buff是应经过角色函数 用于触发触发器
     */
    _buffTable: BuffTable;
    /**所有的技能 */
    private skillTable;
    /**额外数据表 */
    dataTable: JObject;
    /**释放的技能表 用于存储不会立即结束的技能 */
    private castingSkillData;
    constructor(name: string, status: StaticStatusOption);
    /**获取角色的基础属性 */
    getBaseStatus(): Writeable<Buff>;
    /**获取某个计算完增益的属性 */
    private getStaticStatus;
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill: Skill, target: Character[], skillDataOpt?: SkillDataOption): void;
    /**获取某个释放中的技能 */
    getCastingSkill(uid: string | undefined): SkillData | undefined;
    /**结束某个技能 仅用于不会自动结束的技能
     * @param uid 技能的唯一ID
     */
    endSkill(uid: string): void;
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    triggerSkill(skill: Skill, target: Character[], skillDataOpt?: SkillDataOption): void;
    /**获取战斗开始后触发器 */
    getBattleStartT(): import("./Trigger").TBattleStartAfter[];
    /**获得回合结束前触发器 */
    getRoundEndBeforeT(): TRoundEndBefore[];
    /**获得回合开始后触发器 */
    getRoundStartAfterT(): import("./Trigger").TRoundStartAfter[];
    /**结算回合 */
    endRound(roundCount: number): void;
    /**开始行动 */
    startTurn(): void;
    /**结束行动 */
    endTurn(): void;
    /**进行一次行动 */
    turn(func: (char: Character) => void): void;
    /**触发造成伤害前的触发器 */
    getHurtBefore(damage: Damage): void;
    /**触发造成伤害后的触发器 */
    getHurtAfter(damage: Damage): void;
    /**受到伤害 */
    getHurt(damage: Damage): void;
    /**触发受到攻击前的触发器 */
    getHitBefore(attack: Attack): void;
    /**触发受到攻击后的触发器 */
    getHitAfter(attack: Attack): void;
    /**受到攻击击中 */
    getHit(attack: Attack): void;
    /**克隆角色 */
    clone(): Character;
    /**添加技能 同时加入技能的被动buff*/
    addSkill(skill: Skill): void;
    /**获取所有对应触发器 包括全局触发器 技能触发器 */
    private getTriggers;
    /**获取一个Buff的层数 并触发触发器 Get Buff Stack Count And Trigger*/
    getBuffStackCount(buff: Buff): number;
    /**添加一个buff 并触发触发器
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff: Buff, stack?: number, duration?: number): void;
    /**移除某个buff 并触发触发器 */
    removeBuff(buff: Buff): void;
    /**含有某个Buff
     * @param buff      buff
     */
    hasBuff(buff: Buff): boolean;
}
/**角色生成器 */
export interface CharGener {
    /**角色生成器
     * @param name 角色名
     * @param stat 角色属性
     */
    (name?: string, stat?: StaticStatusOption): Character;
}
