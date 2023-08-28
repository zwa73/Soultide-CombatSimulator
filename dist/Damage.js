"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Damage = exports.DamageSpecMap = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffect = exports.DamageIncludeMap = exports.DamageTypeList = void 0;
const OnDamageModify_1 = require("./OnDamageModify");
/**伤害类型枚举 */
exports.DamageTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
const DamageTypeUndefineRecord = exports.DamageTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
/**伤害包含关系表 */
exports.DamageIncludeMap = DamageTypeUndefineRecord;
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
        let dmg = this.factor;
        if (this.hasSpecEffect(exports.固定))
            return dmg;
        //计算修正
        const sourceModlist = this.source.getOnDamageModify()
            .filter(item => !item.mod.isHurtMod && (0, OnDamageModify_1.testConstraints)(this.info, item.mod.constraint));
        const targetModlist = target.getOnDamageModify()
            .filter(item => item.mod.isHurtMod && (0, OnDamageModify_1.testConstraints)(this.info, item.mod.constraint));
        const sourceMod = {};
        const targetMod = {};
        for (let item of sourceModlist) {
            let flag = item.mod.modifyType;
            if (sourceMod[flag] == null)
                sourceMod[flag] = 1;
            sourceMod[flag] += item.mod.number * item.stack;
        }
        for (let item of targetModlist) {
            let flag = item.mod.modifyType;
            if (targetMod[flag] == null)
                targetMod[flag] = 1;
            targetMod[flag] += item.mod.number * item.stack;
        }
        //系数
        dmg += (sourceMod.伤害系数 || 0) + (targetMod.伤害系数 || 0);
        //攻击
        let def = this.hasSpecEffect(exports.穿防) || this.hasSpecEffect(exports.治疗) ? 0 : target.getStaticStatus("defense");
        let atk = this.source.getStaticStatus("attack") * (sourceMod.攻击力 || 1) * (targetMod.攻击力 || 1) - def;
        dmg *= atk > 1 ? atk : 1;
        //附加伤害
        let adddmg = (sourceMod[`${this.info.dmgType}附伤`] || 0) + (sourceMod[`${this.info.dmgType}附伤`] || 0);
        //泛伤
        dmg *= (sourceMod.所有伤害 || 1) * (targetMod.所有伤害 || 1);
        adddmg *= (sourceMod.所有伤害 || 1) * (targetMod.所有伤害 || 1);
        //技伤
        dmg *= (sourceMod.技能伤害 || 1) * (targetMod.技能伤害 || 1);
        //属性伤害
        let tlist = exports.DamageIncludeMap[this.info.dmgType] || [this.info.dmgType];
        for (let t of tlist) {
            let flag = `${t}伤害`;
            dmg *= (sourceMod[flag] || 1) * (sourceMod[flag] || 1);
            adddmg *= (sourceMod[flag] || 1) * (sourceMod[flag] || 1);
        }
        //类别伤害
        for (let t of tlist)
            dmg *= (sourceMod[`${this.info.skillCategory}伤害`] || 1) * (sourceMod[`${this.info.skillCategory}伤害`] || 1);
        //浮动
        if (!this.hasSpecEffect(exports.稳定))
            dmg = dmg + (Math.random() * dmg * 0.1) - dmg * 0.05;
        return dmg + adddmg;
    }
    /**复制一份伤害 */
    clone() {
        return new Damage(this.source, this.factor, this.info, ...this.specEffects);
    }
}
exports.Damage = Damage;
