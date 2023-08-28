"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Damage = exports.DamageSpecMap = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffect = exports.DamageIncludeMap = exports.DamageTypeList = void 0;
//———————————————————— 伤害 ————————————————————//
/**伤害类型枚举 */
exports.DamageTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
/**undefine值的伤害类型Record */
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
        const defset = { addModTable: {}, multModTable: {} };
        const charTableSet = this.source.char ? this.source.char.buffTable.getDamageConsModTable(false, this.info) : defset;
        const skillTableSet = this.source.skill ? this.source.skill.buffTable.getDamageConsModTable(false, this.info) : defset;
        const targetTableSet = target.buffTable.getDamageConsModTable(true, this.info);
        const modTableSet = { multModTable: {}, addModTable: {} };
        function mergeMultMod(baseTable, modTable) {
            for (let flag of Object.keys(modTable)) {
                if (baseTable[flag] == null)
                    baseTable[flag] = 1;
                baseTable[flag] *= modTable[flag];
            }
        }
        function mergeAddMod(baseTable, modTable) {
            for (let flag of Object.keys(modTable)) {
                if (baseTable[flag] == null)
                    baseTable[flag] = 0;
                baseTable[flag] += modTable[flag];
            }
        }
        function mergeTableSet(baseSet, modSet) {
            mergeMultMod(baseSet.multModTable, modSet.multModTable);
            mergeAddMod(baseSet.addModTable, modSet.addModTable);
        }
        mergeTableSet(modTableSet, charTableSet);
        mergeTableSet(modTableSet, targetTableSet);
        mergeTableSet(modTableSet, skillTableSet);
        return modTableSet;
    }
    /**对数值进行增益
     * @param base       基础值
     * @param flag       增益名
     * @param multModMap 倍率Map
     * @param addModMap  加值Map
     */
    modValue(base, flag, tableSet) {
        return (base + (this.source.char ? this.source.char.getStaticStatus(flag) : 0) + (tableSet.addModTable[flag] || 0)) * (tableSet.multModTable[flag] || 1);
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
        const modTableSet = this.calcOnDamageModify(target);
        console.log(modTableSet);
        //系数
        dmg = this.modValue(dmg, "伤害系数", modTableSet);
        //攻击
        let def = this.hasSpecEffect(exports.穿防) || this.hasSpecEffect(exports.治疗) ? 0 : target.getStaticStatus("防御");
        let atk = this.modValue(0, "攻击", modTableSet);
        dmg *= (atk - def) > 1 ? (atk - def) : 1;
        //附加伤害
        let adddmg = this.modValue(0, `${dmgType}附伤`, modTableSet);
        //泛伤
        dmg = this.modValue(dmg, `所有伤害`, modTableSet);
        adddmg = this.modValue(adddmg, `所有伤害`, modTableSet);
        //技伤
        dmg = this.modValue(dmg, `技能伤害`, modTableSet);
        //属性伤害
        for (let t of exports.DamageIncludeMap[this.info.dmgType]) {
            dmg = this.modValue(dmg, `${t}伤害`, modTableSet);
            adddmg = this.modValue(adddmg, `${t}伤害`, modTableSet);
        }
        //类别伤害
        dmg = this.modValue(dmg, `${skillCategory}伤害`, modTableSet);
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
