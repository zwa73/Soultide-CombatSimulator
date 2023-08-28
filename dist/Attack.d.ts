import { Character } from "./CombatSimulation";
import { Damage } from "./Damage";
/**造成技能攻击 */
export declare class Attack {
    /**攻击的伤害 */
    private readonly damage;
    /**攻击来源 */
    readonly source: Character;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source: Character, damage: Damage);
    /**计算一段攻击伤害 */
    calcDamage(): Damage;
    /**复制攻击 */
    clone(): Attack;
}
