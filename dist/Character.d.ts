import { Attack } from "./Attack";
import { Battlefield } from "./CombatSimulation";
import { Damage, DamageInfo } from "./Damage";
import { Buff, BuffTable } from "./Modify";
import { Skill } from "./Skill";
import { DynmaicStatus, StaticStatusKey, StaticStatusOption } from "./Status";
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
    constructor(name: string, status: StaticStatusOption);
    /**获取角色的基础属性 */
    getBaseStatus(): Buff;
    /**获取某个计算完增益的属性 */
    getStaticStatus(field: StaticStatusKey, isHurt?: boolean, damageInfo?: DamageInfo): number;
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff: Buff, stack?: number, countdown?: number): void;
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill: Skill, target: Character[], isTiggerSkill?: boolean): void;
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    tiggerSkill(skill: Skill, target: Character[]): void;
    /**结算回合 */
    endRound(): void;
    /**受到伤害 */
    getHurt(damage: Damage): void;
    /**受到攻击 */
    getHit(attack: Attack): void;
    /**克隆角色 */
    clone(): Character;
}
