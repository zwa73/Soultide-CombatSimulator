import { AnyHook, AnyTigger, HookTiggerMap } from './Tigger';
import { Skill } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { OnDamageModify } from './OnDamageModify';
/**静态属性 */
export type StaticStatus = {
    /**最大生命值 */
    maxHealth: number;
    /**攻击力 */
    attack: number;
    /**速度 */
    speed: number;
    /**防御力 */
    defense: number;
    /**暴击率 */
    critRate: number;
    /**暴击伤害 */
    critDamage: number;
    /**初始怒气 */
    startEnergy: number;
    /**闪避 */
    dodge: number;
};
/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;
/**当前属性 */
export type DynmaicStatus = {
    /**当前生命 */
    health: number;
    /**当前怒气 */
    energy: number;
};
/**附加状态 */
export type Buff = {
    /**名称 */
    name: string;
    /**可叠加 */
    canSatck?: boolean;
    /**层数 */
    stackCount?: number;
    /**面板倍率增益 */
    statusMultModify?: StaticStatusOption;
    /**叠加的面板倍率增益 */
    stackStatausMultModify?: StaticStatusOption;
    /**伤害时的增益 */
    modifyOnDamages?: OnDamageModify[];
    /**叠加的伤害时的增益 */
    stackModifyOnDamages?: OnDamageModify[];
    /**触发器 */
    tiggerList?: AnyTigger[];
};
/**角色 */
export declare class Character {
    /**角色处在的战场 */
    battlefield: Battlefield;
    /**角色的静态属性 */
    staticStatus: StaticStatus;
    /**角色的当前属性 */
    dynmaicStatus: DynmaicStatus;
    /**所有的附加状态 */
    buffTable: Record<string, {
        stackCount: number;
        buff: Buff;
    }>;
    constructor({ maxHealth, attack, speed, defense, critRate, critDamage, startEnergy, dodge }: StaticStatusOption);
    /**获取某个计算完增益的属性 */
    getStaticStatus(field: keyof StaticStatus): number;
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook: T): HookTiggerMap[T][];
    addBuff(buff: Buff, stackCount: number): void;
    /**获取所有伤害时生效的增益 */
    getOnDamageModify(): {
        /**增益 */
        mod: OnDamageModify;
        /**叠加数 */
        stack: number;
    }[];
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     */
    useSkill(skill: Skill, target: Character[]): void;
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
