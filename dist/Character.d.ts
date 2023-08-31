import { Writeable } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield } from "./Battlefield";
import { Damage } from "./Damage";
import { Buff, BuffTable } from "./Modify";
import { Skill, SkillDataOption, SkillName } from "./Skill";
import { DynmaicStatus, StaticStatusOption } from "./Status";
/**角色 */
export declare class Character {
    /**角色名称 */
    name: string;
    /**角色处在的战场 */
    battlefield: Battlefield;
    /**角色的当前属性 */
    dynmaicStatus: DynmaicStatus;
    /**所有的附加状态 */
    buffTable: BuffTable;
    /**所有的技能 */
    skillTable: Record<SkillName, Skill>;
    /**额外数据表 */
    dataTable: Record<string, any>;
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
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    tiggerSkill(skill: Skill, target: Character[], skillDataOpt?: SkillDataOption): void;
    /**结算回合 */
    endRound(): void;
    /**受到伤害 */
    getHurt(damage: Damage): void;
    /**受到攻击击中 */
    getHit(attack: Attack): void;
    /**克隆角色 */
    clone(): Character;
    /**添加技能 同时加入技能的被动buff*/
    addSkill(skill: Skill): void;
    /**获取所有对应触发器 包括全局触发器 技能触发器 */
    private getTiggers;
    /**获取一个Buff的层数
     * @deprecated 这个函数不会触发"获取状态层数"触发器
     */
    getBuffStackCountWithoutT(buff: Buff): number;
    /**获取一个Buff的层数 并触发触发器*/
    getBuffStackCountAndT(buff: Buff): number;
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff: Buff, stack?: number, duration?: number): void;
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
