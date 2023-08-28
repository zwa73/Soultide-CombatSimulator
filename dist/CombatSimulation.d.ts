import { JObject } from '@zwa73/utils';
import { AnyHook, AnyTigger, HookTiggerMap } from './Tigger';
import { Skill } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { DamageInfoConstraintList, ModifyType } from './OnDamageModify';
/**静态属性 */
export type StaticStatus = {
    /**最大生命 */
    最大生命: number;
    /**攻击 */
    攻击: number;
    /**速度 */
    速度: number;
    /**防御 */
    防御: number;
    /**暴击率 */
    暴击率: number;
    /**暴击伤害 */
    暴击伤害: number;
    /**初始怒气 */
    初始怒气: number;
    /**闪避 */
    闪避: number;
} & Record<ModifyType, number>;
/**默认的属性 */
export declare const DefStaticStatus: StaticStatus;
/**静态属性键 */
export type StaticStatusKey = keyof StaticStatus;
/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;
/**当前属性 */
export type DynmaicStatus = {
    /**当前生命 */
    当前生命: number;
    /**当前怒气 */
    当前怒气: number;
};
/**附加状态 */
export type Buff = {
    /**名称 */
    name: string;
    /**可叠加 */
    canSatck?: boolean;
    /**结束时间点 数字为经过回合数 hook字段为下一次hook触发时 默认则不结束*/
    endWith?: number | AnyHook;
    /**倍率增益 */
    multModify?: StaticStatusOption;
    /**叠加的倍率增益 */
    stackMultModify?: StaticStatusOption;
    /**数值增益 */
    addModify?: StaticStatusOption;
    /**叠加的数值增益 */
    stackAddModify?: StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    damageConstraint?: DamageInfoConstraintList;
    /**触发器 */
    tiggerList?: AnyTigger[];
    /**内部参数表 */
    table?: JObject;
};
/**叠加的buff */
export type StackBuff = {
    /**buff类型 */
    buff: Buff;
    /**叠加层数 */
    stack: number;
};
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
    buffTable: Record<string, StackBuff>;
    constructor(name: string, opt: StaticStatusOption);
    /**获取某个计算完增益的属性 */
    getStaticStatus(field: StaticStatusKey): number;
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook: T): HookTiggerMap[T][];
    addBuff(buff: Buff, stack: number): void;
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
