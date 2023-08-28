"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attack = void 0;
const Damage_1 = require("./Damage");
/**造成技能攻击 */
class Attack {
    /**攻击的伤害 */
    damage;
    /**攻击来源 */
    source;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source, damage) {
        this.source = source;
        this.damage = damage;
    }
    /**计算一段攻击伤害 */
    calcDamage() {
        let critRate = this.source.getStaticStatus("暴击率");
        let currDamage = this.damage.clone();
        if (Math.random() < critRate)
            currDamage.specEffects.push(Damage_1.暴击);
        return currDamage;
    }
    /**复制攻击 */
    clone() {
        return new Attack(this.source, this.damage.clone());
    }
}
exports.Attack = Attack;
