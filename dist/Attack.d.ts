import { Character } from "./Character";
import { Damage } from "./Damage";
import { BuffTable } from "./Modify";
import { SkillData } from "./Skill";
/**攻击来源 */
export type AttackSource = {
    /**角色来源 */
    char?: Character;
    /**技能来源 */
    skill?: SkillData;
};
/**造成技能攻击 */
export declare class Attack {
    /**攻击的伤害 */
    private readonly damage;
    /**攻击来源 */
    readonly source: AttackSource;
    /**只应用于此次攻击的Buff */
    readonly buffTable: BuffTable;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source: AttackSource, damage: Damage);
    /**计算一段攻击伤害 */
    calcDamage(target: Character): Damage;
    /**复制攻击 */
    clone(): Attack;
}
