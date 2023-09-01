"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSkillDamage = exports.genNonSkillDamage = exports.genDamageInfo = exports.Damage = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffect = void 0;
const Modify_1 = require("./Modify");
//———————————————————— 伤害 ————————————————————//
/**伤害类型枚举 */
const DamageBaseTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
/**伤害包含关系表 */
const DamageIncludeMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [`${key}伤害`] }), {});
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
    /**计算攻击时 来源的 应用的加值与倍率
     * @returns [ multModMap, addModMap ]
     */
    calcSourceModSetTable() {
        //计算角色的buff
        const charSetTable = this.source.char
            ? this.source.char.buffTable.getModSetTable(this.info)
            : new Modify_1.ModSetTable();
        //console.log("charSetTable",charSetTable)
        //计算技能的buff
        const skillSetTable = this.source.skillData
            ? this.source.skillData.buffTable.getModSetTable(this.info)
            : new Modify_1.ModSetTable();
        //计算攻击的buff
        const attackSetTable = this.source.attack
            ? this.source.attack.buffTable.getModSetTable(this.info)
            : new Modify_1.ModSetTable();
        //console.log("targetSetTable",targetSetTable)
        return Modify_1.ModSetTable.addSet(charSetTable, skillSetTable, attackSetTable);
    }
    /**含有某个特效 */
    hasSpecEffect(flag) {
        return this.specEffects.includes(flag) || DamageSpecMap[this.info.dmgType]?.includes(flag);
    }
    /**计算伤害 */
    calcOverdamage(target) {
        const { dmgType, skillCategory, skillRange } = this.info;
        //需要附伤
        const needAdd = this.isSkillDamage();
        //基础系数
        let dmg = this.factor;
        //console.log("基础系数",this.factor)
        if (this.hasSpecEffect(exports.固定))
            return dmg;
        const targetModTable = target.buffTable.getModSetTable(this.info);
        const sourceModTable = this.calcSourceModSetTable();
        //console.log(sourceModSetTable);
        //console.log(targetModSetTable);
        /**对数值进行增益  目标Set与来源Set加算
         * @param base       		基础值
         * @param flag       		标签
         * @param targetFlag 		目标的标签
         */
        function modValue(base, flag, targetFlag) {
            return Modify_1.ModSet.addSet(sourceModTable.getModSet(flag), targetModTable.getModSet(targetFlag)).modValue(base);
        }
        //系数
        dmg = modValue(dmg, "伤害系数", "受到伤害系数");
        //防御
        let def = targetModTable.getModSet("防御").modValue(0);
        def = this.hasSpecEffect(exports.穿防) || this.hasSpecEffect(exports.治疗) ? 0 : def;
        //穿防
        let pendef = Modify_1.ModSet.addSet(targetModTable.getModSet("受到穿透防御"), sourceModTable.getModSet("穿透防御"));
        def = (def) * (1 - pendef.modValue(0));
        //攻击
        let atk = modValue(0, "攻击", "受到攻击");
        dmg *= atk - def > 1 ? atk - def : 1;
        //附加伤害
        let adddmg = 0;
        if (needAdd)
            adddmg = modValue(0, AddiDamageIncludeMap[dmgType], `受到${AddiDamageIncludeMap[dmgType]}`);
        //泛伤
        dmg = modValue(dmg, "所有伤害", "受到所有伤害");
        if (needAdd)
            adddmg = modValue(adddmg, "所有伤害", "受到所有伤害");
        //技伤
        dmg = modValue(dmg, `技能伤害`, "受到技能伤害");
        //属性伤害
        for (let t of DamageIncludeMap[this.info.dmgType]) {
            dmg = modValue(dmg, t, `受到${t}`);
            if (needAdd)
                adddmg = modValue(adddmg, t, `受到${t}`);
        }
        //类别伤害
        if (skillCategory != undefined)
            dmg = modValue(dmg, `${skillCategory}伤害`, `受到${skillCategory}伤害`);
        //范围类型伤害
        if (skillRange != undefined)
            dmg = modValue(dmg, `${skillRange}伤害`, `受到${skillRange}伤害`);
        //暴击伤害
        if (this.hasSpecEffect(exports.暴击)) {
            let critdmg = modValue(0, `暴击伤害`, `受到暴击伤害`);
            dmg = dmg * critdmg;
        }
        //合并附伤
        dmg += adddmg;
        //浮动 +-5%
        if (!this.hasSpecEffect(exports.稳定))
            dmg = dmg - (dmg * 0.05) + (Math.random() * dmg * 0.1);
        return Math.floor(dmg);
    }
    /**是技能伤害 */
    isSkillDamage() {
        return this.info.skillType != "非技能";
    }
    /**复制一份伤害 */
    clone() {
        return new Damage(this.source, this.factor, this.info, ...this.specEffects);
    }
}
exports.Damage = Damage;
/**生成伤害信息 */
function genDamageInfo(dmgType, info) {
    return {
        skillName: info ? info.skillName : undefined,
        skillCategory: info ? info.skillCategory : undefined,
        skillRange: info ? info.skillRange : undefined,
        skillType: info ? info.skillType : "非技能",
        skillSubtype: info ? info.skillSubtype : undefined,
        dmgType: dmgType,
    };
}
exports.genDamageInfo = genDamageInfo;
/**产生非技能伤害 */
function genNonSkillDamage(factor, dmgType, char, ...specEffects) {
    return new Damage({ char: char }, factor, genDamageInfo(dmgType), ...specEffects);
}
exports.genNonSkillDamage = genNonSkillDamage;
/**产生技能伤害 */
function genSkillDamage(factor, dmgType, skillData, ...specEffects) {
    return new Damage({
        char: skillData?.user,
        skillData: skillData
    }, factor, genDamageInfo(dmgType, skillData?.skill.info), ...specEffects);
}
exports.genSkillDamage = genSkillDamage;
