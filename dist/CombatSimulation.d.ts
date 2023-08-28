import { Skill } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { Buff, BuffTable } from './Modify';
import { DynmaicStatus, StaticStatus, StaticStatusKey, StaticStatusOption } from './Status';
/**角色 */
export declare class Character {
    /**角色名称 */
    name: string;
    /**角色处在的战场 */
    battlefield: Battlefield;
    /**角色的静态属性 */
    staticStatus: StaticStatus;
    /**角色的当前属性 */
    dynmaicStatus: DynmaicStatus;
    /**所有的附加状态 */
    buffTable: BuffTable;
    constructor(name: string, opt: StaticStatusOption);
    /**获取某个计算完增益的属性 */
    getStaticStatus(field: StaticStatusKey): number;
    /**添加一个buff */
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
/**队伍类型 */
export type TeamType = "A" | "B";
/**队形 */
export declare class Formation {
    /**前排 */
    forward: Character[];
    /**后排 */
    backward: Character[];
    constructor();
    /**获取前排 */
    getForward(): Character[];
    /**获取后排 */
    getBackward(): Character[];
    /**含有角色 */
    hasCharacter(): boolean;
}
/**战场 */
export declare class Battlefield {
    teamMap: Record<TeamType, Formation>;
    roundCount: number;
    constructor();
    /**添加角色 */
    addCharacter(team: TeamType, pos: "forward" | "backward", ...chars: Character[]): void;
    /**经过一回合 */
    nextRound(): number;
}
export declare const DefaultBattlefield: Battlefield;
