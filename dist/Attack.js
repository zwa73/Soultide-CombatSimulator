"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAttack = exports.Attack = void 0;
const Damage_1 = require("./Damage");
const Modify_1 = require("./Modify");
/**造成技能攻击 */
class Attack {
    /**攻击的伤害 */
    damage;
    /**攻击来源 */
    source;
    /**只应用于此次攻击的Buff */
    buffTable;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source, damage) {
        this.buffTable = new Modify_1.BuffTable(source.char);
        this.source = source;
        this.damage = damage;
        this.damage.source.attack = this;
    }
    /**计算一段攻击伤害 */
    calcDamage(target) {
        //暴击率
        const charCrit = this.source.char._buffTable.getModSet("暴击率");
        const skillCrit = this.source.skillData.buffTable.getModSet("暴击率");
        const targetCrit = target._buffTable.getModSet("受到暴击率");
        const critSet = Modify_1.ModSet.multSet(targetCrit, Modify_1.ModSet.addSet(charCrit, skillCrit));
        const critRate = critSet.modValue(0);
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
/**产生攻击 */
function genAttack(skillData, factor, dmgType, ...specEffects) {
    return new Attack({ char: skillData.user, skillData: skillData }, (0, Damage_1.genSkillDamage)(factor, dmgType, skillData, ...specEffects));
}
exports.genAttack = genAttack;
