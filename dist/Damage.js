"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Damage = exports.DamageSpecMap = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffect = exports.DamageIncludeMap = exports.DamageTypeList = void 0;
const OnDamageModify_1 = require("./OnDamageModify");
/**伤害类型枚举 */
exports.DamageTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
const DamageTypeUndefineRecord = exports.DamageTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
/**伤害包含关系表 */
exports.DamageIncludeMap = Object.keys(DamageTypeUndefineRecord).reduce((acc, key) => ({ ...acc, [key]: [key] }), {});
exports.DamageIncludeMap.雷电 = ["雷电", "电击"];
exports.DamageIncludeMap.冰霜 = ["冰霜", "极寒"];
exports.DamageIncludeMap.火焰 = ["火焰", "燃烧"];
exports.DamageIncludeMap.魔法 = ["魔法", "暗蚀"];
exports.DamageIncludeMap.物理 = ["物理", "流血"];
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
exports.DamageSpecMap = DamageTypeUndefineRecord;
exports.DamageSpecMap.治疗 = [exports.治疗];
exports.DamageSpecMap.固定 = [exports.固定, exports.稳定, exports.穿防];
exports.DamageSpecMap.燃烧 = [exports.穿盾];
function calcOnDamageModify(multMod, addMod, buffList) {
    for (let item of buffList) {
        let basedMultTable = item.buff.multModify || {};
        let stackMultTable = item.buff.stackMultModify || {};
        let basedAddTable = item.buff.addModify || {};
        let stackAddTable = item.buff.stackAddModify || {};
        let stack = item.stack;
        for (let flag of Object.keys(basedMultTable)) {
            if (multMod[flag] == null)
                multMod[flag] = 1;
            multMod[flag] += basedMultTable[flag];
        }
        for (let flag of Object.keys(stackMultTable)) {
            if (multMod[flag] == null)
                multMod[flag] = 1;
            multMod[flag] += stackMultTable[flag] * stack;
        }
        for (let flag of Object.keys(basedAddTable)) {
            if (addMod[flag] == null)
                addMod[flag] = 0;
            addMod[flag] += basedAddTable[flag];
        }
        for (let flag of Object.keys(stackAddTable)) {
            if (addMod[flag] == null)
                addMod[flag] = 0;
            addMod[flag] += stackAddTable[flag] * stack;
        }
    }
}
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
     * @param category    伤害类别
     * @param specEffects 特殊效果
     */
    constructor(source, factor, info, ...specEffects) {
        this.source = source;
        this.factor = factor;
        this.info = info;
        this.specEffects = specEffects;
    }
    /**含有某个特效 */
    hasSpecEffect(flag) {
        return this.specEffects.includes(flag) || exports.DamageSpecMap[this.info.dmgType]?.includes(flag);
    }
    /**计算伤害 */
    calcOverdamage(target) {
        const { dmgType, skillCategory } = this.info;
        let dmg = this.factor;
        if (this.hasSpecEffect(exports.固定))
            return dmg;
        //计算伤害约束的buff
        const sourceBuffList = Object.values(this.source.buffTable)
            .filter(item => item.buff.damageConstraint &&
            (0, OnDamageModify_1.matchCons)(false, this.info, item.buff.damageConstraint));
        const targetMultList = Object.values(target.buffTable)
            .filter(item => item.buff.damageConstraint &&
            (0, OnDamageModify_1.matchCons)(true, this.info, item.buff.damageConstraint));
        const sourceMultMod = {};
        const sourceAddMod = {};
        const targetMultMod = {};
        const targetAddMod = {};
        calcOnDamageModify(sourceMultMod, sourceAddMod, sourceBuffList);
        calcOnDamageModify(targetMultMod, targetAddMod, targetMultList);
        //系数
        dmg = (dmg + (sourceAddMod.伤害系数 || 0) + (targetAddMod.伤害系数 || 0)) *
            (sourceMultMod.伤害系数 || 1) * (targetMultMod.伤害系数 || 1);
        //攻击
        let def = this.hasSpecEffect(exports.穿防) || this.hasSpecEffect(exports.治疗) ? 0 : target.getStaticStatus("防御");
        let atk = (this.source.getStaticStatus("攻击") + (sourceAddMod.攻击 || 0) + (targetAddMod.攻击 || 0)) *
            (sourceMultMod.攻击 || 1) * (targetMultMod.攻击 || 1) - def;
        dmg *= atk > 1 ? atk : 1;
        //附加伤害
        let adddmg = ((sourceAddMod[`${dmgType}附伤`] || 0) + (targetAddMod[`${dmgType}附伤`] || 0)) *
            (targetMultMod[`${dmgType}附伤`] || 1) * (targetMultMod[`${dmgType}附伤`] || 1);
        //泛伤
        dmg = (dmg + (sourceAddMod.所有伤害 || 0) + (targetAddMod.所有伤害 || 0)) *
            (sourceMultMod.所有伤害 || 1) * (targetMultMod.所有伤害 || 1);
        adddmg = (adddmg + (sourceAddMod.所有伤害 || 0) + (targetAddMod.所有伤害 || 0)) *
            (sourceMultMod.所有伤害 || 1) * (targetMultMod.所有伤害 || 1);
        //技伤
        dmg = (dmg + (sourceAddMod.技能伤害 || 0) + (targetAddMod.技能伤害 || 0)) *
            (sourceMultMod.技能伤害 || 1) * (targetMultMod.技能伤害 || 1);
        //属性伤害
        for (let t of exports.DamageIncludeMap[this.info.dmgType]) {
            let flag = `${t}伤害`;
            dmg = (dmg + (sourceAddMod[flag] || 0) + (targetAddMod[flag] || 0))
                * (sourceMultMod[flag] || 1) * (targetMultMod[flag] || 1);
            adddmg = (adddmg + (sourceAddMod[flag] || 0) + (targetAddMod[flag] || 0))
                * (sourceMultMod[flag] || 1) * (targetMultMod[flag] || 1);
        }
        //类别伤害
        dmg = (dmg + (sourceAddMod[`${skillCategory}伤害`] || 0) + (targetAddMod[`${skillCategory}伤害`] || 0)) *
            (sourceMultMod[`${skillCategory}伤害`] || 1) * (targetMultMod[`${skillCategory}伤害`] || 1);
        //合并附伤
        dmg += adddmg;
        //浮动
        if (!this.hasSpecEffect(exports.稳定))
            dmg = dmg + (Math.random() * dmg * 0.1) - dmg * 0.05;
        return Math.floor(dmg);
    }
    /**复制一份伤害 */
    clone() {
        return new Damage(this.source, this.factor, this.info, ...this.specEffects);
    }
}
exports.Damage = Damage;
