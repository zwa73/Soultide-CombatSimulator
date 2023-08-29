"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attack = void 0;
const Damage_1 = require("./Damage");
const Modify_1 = require("./Modify");
/**造成技能攻击 */
class Attack {
    /**攻击的伤害 */
    damage;
    /**攻击来源 */
    source;
    /**只应用于此次攻击的Buff */
    buffTable = new Modify_1.BuffTable();
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source, damage) {
        this.source = source;
        this.damage = damage;
        this.damage.source.attack = this;
    }
    /**计算一段攻击伤害 */
    calcDamage(target) {
        //暴击率
        const charCrit = this.source.char
            ? this.source.char.buffTable.getModSet("暴击率")
            : Modify_1.DefModSet;
        const skillCrit = this.source.skill
            ? this.source.skill.buffTable.getModSet("暴击率")
            : Modify_1.DefModSet;
        const targetCrit = target.buffTable.getModSet("暴击率", true);
        const critSet = (0, Modify_1.multModSet)(targetCrit, (0, Modify_1.addModSet)(charCrit, skillCrit));
        const critRate = critSet.add * critSet.mult;
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
