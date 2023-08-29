"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Damage = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffect = void 0;
const Modify_1 = require("./Modify");
//———————————————————— 伤害 ————————————————————//
/**伤害类型枚举 */
const DamageBaseTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
/**伤害包含关系表 */
const DamageIncludeMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [key]: [key] }), {});
DamageIncludeMap.雷电伤害 = ["雷电伤害", "电击伤害"];
DamageIncludeMap.冰霜伤害 = ["冰霜伤害", "极寒伤害"];
DamageIncludeMap.火焰伤害 = ["火焰伤害", "燃烧伤害"];
DamageIncludeMap.魔法伤害 = ["魔法伤害", "暗蚀伤害"];
DamageIncludeMap.物理伤害 = ["物理伤害", "流血伤害"];
/**附伤关系表 */
const AddiDamageIncludeMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [`${key}附伤`] }), {});
/**伤害特效 */
var SpecEffect;
(function (SpecEffect) {
    /**造成治疗 */
    SpecEffect["\u6CBB\u7597"] = "\u6CBB\u7597";
    /**不享受任何加成 造成相当于系数的伤害 */
    SpecEffect["\u56FA\u5B9A"] = "\u56FA\u5B9A";
    /**不会浮动 */
    SpecEffect["\u7A33\u5B9A"] = "\u7A33\u5B9A";
    /**穿透护盾 */
    SpecEffect["\u7A7F\u76FE"] = "\u7A7F\u76FE";
    /**忽视防御 */
    SpecEffect["\u7A7F\u9632"] = "\u7A7F\u9632";
    /**暴击伤害 */
    SpecEffect["\u66B4\u51FB"] = "\u66B4\u51FB";
})(SpecEffect = exports.SpecEffect || (exports.SpecEffect = {}));
;
exports.治疗 = SpecEffect.治疗, exports.固定 = SpecEffect.固定, exports.稳定 = SpecEffect.稳定, exports.穿盾 = SpecEffect.穿盾, exports.穿防 = SpecEffect.穿防, exports.暴击 = SpecEffect.暴击;
/**伤害特殊效果表 */
const DamageSpecMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
;
DamageSpecMap.治疗伤害 = [exports.治疗];
DamageSpecMap.固定伤害 = [exports.固定, exports.稳定, exports.穿防];
DamageSpecMap.燃烧伤害 = [exports.穿盾];
/**伤害 */
class Damage {
    /**伤害详细类型 */
    info;
    /**系数 */
    factor;
    /**特效 */
    specEffects = [];
    /**来源 */
    source;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param specEffects 特殊效果
     */
    constructor(source, factor, info, ...specEffects) {
        this.source = source;
        this.factor = factor;
        this.info = info;
        this.specEffects = specEffects;
    }
    /**计算攻击时应用的加值与倍率
     * @param target  受伤角色
     * @returns [ multModMap, addModMap ]
     */
    calcOnDamageModify(target) {
        //计算伤害约束的buff
        const charTableSet = this.source.char
            ? this.source.char.buffTable.getModTableSet(false, this.info)
            : Modify_1.DefModTableSet;
        //console.log("charTableSet",charTableSet)
        const skillTableSet = this.source.skill
            ? this.source.skill.buffTable.getModTableSet(false, this.info)
            : Modify_1.DefModTableSet;
        const attackTableSet = this.source.attack
            ? this.source.attack.buffTable.getModTableSet(false, this.info)
            : Modify_1.DefModTableSet;
        //console.log("skillTableSet",skillTableSet)
        const targetTableSet = target.buffTable.getModTableSet(true, this.info);
        //console.log("targetTableSet",targetTableSet)
        return (0, Modify_1.multModTableSet)((0, Modify_1.addModTableSet)(charTableSet, skillTableSet, attackTableSet), targetTableSet);
    }
    /**对数值进行增益
     * @param base       基础值
     * @param flag       增益名
     * @param multModMap 倍率Map
     * @param addModMap  加值Map
     */
    modValue(base, flag, tableSet) {
        return ((base + (tableSet.addModTable[flag] || 0)) *
            (tableSet.multModTable[flag] || 1));
    }
    /**含有某个特效 */
    hasSpecEffect(flag) {
        return this.specEffects.includes(flag) || DamageSpecMap[this.info.dmgType]?.includes(flag);
    }
    /**计算伤害 */
    calcOverdamage(target) {
        const { dmgType, skillCategory } = this.info;
        let dmg = this.factor;
        if (this.hasSpecEffect(exports.固定))
            return dmg;
        const modTableSet = this.calcOnDamageModify(target);
        console.log(modTableSet);
        //系数
        dmg = this.modValue(dmg, "伤害系数", modTableSet);
        //攻击
        let def = this.hasSpecEffect(exports.穿防) || this.hasSpecEffect(exports.治疗) ? 0 : target.getStaticStatus("防御");
        let atk = this.modValue(0, "攻击", modTableSet);
        dmg *= atk - def > 1 ? atk - def : 1;
        //附加伤害
        let needAdd = this.info.skillType != "非技能";
        let adddmg = 0;
        if (needAdd)
            adddmg = this.modValue(0, AddiDamageIncludeMap[dmgType], modTableSet);
        //泛伤
        dmg = this.modValue(dmg, "所有伤害", modTableSet);
        if (needAdd)
            adddmg = this.modValue(adddmg, "所有伤害", modTableSet);
        //技伤
        dmg = this.modValue(dmg, `技能伤害`, modTableSet);
        //属性伤害
        for (let t of DamageIncludeMap[this.info.dmgType]) {
            dmg = this.modValue(dmg, t, modTableSet);
            if (needAdd)
                adddmg = this.modValue(adddmg, t, modTableSet);
        }
        //类别伤害
        dmg = this.modValue(dmg, `${skillCategory}伤害`, modTableSet);
        //合并附伤
        dmg += adddmg;
        //浮动
        if (!this.hasSpecEffect(exports.稳定))
            dmg = dmg + Math.random() * dmg * 0.1 - dmg * 0.05;
        return Math.floor(dmg);
    }
    /**复制一份伤害 */
    clone() {
        return new Damage(this.source, this.factor, this.info, ...this.specEffects);
    }
}
exports.Damage = Damage;
