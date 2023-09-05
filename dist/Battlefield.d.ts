import { Character } from './Character';
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
    /**获取全部角色 */
    getAllChars(): Character[];
    /**含有任何角色 */
    hasAnyCharacter(): boolean;
    /**含有角色 */
    hasCharacter(char: Character): boolean;
}
/**战场 */
export declare class Battlefield {
    teamMap: Record<TeamType, Formation>;
    roundCount: number;
    isStart: boolean;
    constructor();
    /**添加角色 */
    addCharacter(team: TeamType, pos: "forward" | "backward", ...chars: Character[]): void;
    /**触发 回合结束前 触发器 */
    roundEndBefore(): void;
    /**触发 回合开始后 触发器 */
    roundStartAfter(): void;
    /**经过一回合
     * @returns 回合数
     */
    endRound(): number;
    /**进行一回合 */
    round(func?: () => void): void;
    /**触发 战斗开始后 触发器 */
    battleStartAfter(): void;
    /**战斗开始时 */
    startBattle(): void;
}
export declare const DefaultBattlefield: Battlefield;
