"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSkillDamage = exports.genNonSkillDamage = exports.genDamageInfo = exports.Damage = void 0;
const Modify_1 = require("./Modify");
/**伤害类型枚举 */
const DamageBaseTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "固定"];
/**子伤害依赖表
 * 如果key的值非undefine
 * 则 key 使用 value[number] 作为基础伤害乘区 自身伤害类型作为额外乘区
 */
const SubDamageRelyMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [] }), {});
SubDamageRelyMap.电击伤害 = ["雷电伤害"];
SubDamageRelyMap.极寒伤害 = ["冰霜伤害"];
SubDamageRelyMap.燃烧伤害 = ["火焰伤害"];
SubDamageRelyMap.暗蚀伤害 = ["魔法伤害"];
SubDamageRelyMap.流血伤害 = ["物理伤害"];
/**附伤关系表 */
const AddiDamageIncludeMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [`${key}附伤`] }), {});
const SpecEffectList = ["固定", "稳定", "穿盾", "穿防", "暴击", "鸣响", "不击破"];
//固定 不享受任何加成 造成相当于系数的伤害
//稳定 不会浮动
//穿盾 穿透护盾
//穿防 忽视防御
//暴击 暴击伤害
//鸣响 鸣响技能的伤害
//不击破 不击破弱点
/**伤害特殊效果表 */
const DamageSpecMap = DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
;
DamageSpecMap.固定伤害 = ["固定特效", "稳定特效", "穿防特效"];
DamageSpecMap.燃烧伤害 = ["穿盾特效"];
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
            ? this.source.char._buffTable.getModSetTable(this)
            : new Modify_1.ModSetTable();
        //console.log("charSetTable",charSetTable)
        //计算技能的buff
        const skillSetTable = this.source.skillData
            ? this.source.skillData.buffTable.getModSetTable(this)
            : new Modify_1.ModSetTable();
        //计算攻击的buff
        const attackSetTable = this.source.attack
            ? this.source.attack.buffTable.getModSetTable(this)
            : new Modify_1.ModSetTable();
        //console.log("targetSetTable",targetSetTable)
        return Modify_1.ModSetTable.addSet(charSetTable, skillSetTable, attackSetTable);
    }
    /**含有任何一个特效 */
    hasSpecEffect(...flags) {
        for (let flag of flags) {
            let typeEffect = [];
            if ("dmgType" in this.info)
                DamageSpecMap[this.info.dmgType];
            if (this.specEffects.includes(flag) || typeEffect.includes(flag))
                return true;
        }
        return false;
    }
    /**获取所有特效 */
    getSpecEffectList() {
        let typeEffect = [];
        if ("dmgType" in this.info)
            DamageSpecMap[this.info.dmgType];
        return [...this.specEffects, ...typeEffect];
    }
    /**计算伤害 */
    calcOverdamage(target) {
        if (!("dmgType" in this.info))
            throw "试图计算一个治疗伤害";
        const { dmgType, dmgCategory } = this.info;
        let skillCategory;
        let skillRange;
        if (this.info.skillType != "非技能") {
            skillCategory = this.info.skillCategory;
            skillRange = this.info.skillRange;
        }
        else {
            skillCategory = undefined;
            skillRange = undefined;
        }
        //需要附伤
        const needAdd = this.isSkillDamage();
        //是子伤害
        const isSubDamage = SubDamageRelyMap[dmgType].length > 0;
        //基础系数
        let dmg = this.factor;
        //console.log("基础系数",this.factor)
        if (this.hasSpecEffect("固定特效"))
            return dmg;
        const targetModTable = target._buffTable.getModSetTable(this);
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
        def = this.hasSpecEffect("穿防特效") ? 0 : def;
        //穿防
        let pendef = Modify_1.ModSet.addSet(targetModTable.getModSet("受到穿透防御"), sourceModTable.getModSet("穿透防御"));
        def = (def - pendef.add) - (def * (pendef.mult - 1));
        //攻击
        let atk = modValue(0, "攻击", "受到攻击");
        dmg *= atk - def > 1 ? atk - def : 1;
        //附加伤害
        let adddmg = 0;
        if (needAdd)
            adddmg = modValue(0, AddiDamageIncludeMap[dmgType], `受到${AddiDamageIncludeMap[dmgType]}`);
        //泛伤和属性伤害 乘区 治疗不享受此乘区
        let baseDmgMod = Modify_1.ModSet.addSet(sourceModTable.getModSet(dmgCategory), targetModTable.getModSet(`受到${dmgCategory}`));
        //子伤害使用主伤害作为基础区
        if (isSubDamage) {
            for (let t of SubDamageRelyMap[dmgType]) {
                baseDmgMod = baseDmgMod.addSet(sourceModTable.getModSet(t), targetModTable.getModSet(`受到${t}`));
            }
        }
        else {
            baseDmgMod = baseDmgMod.addSet(sourceModTable.getModSet(dmgType), targetModTable.getModSet(`受到${dmgType}`));
        }
        dmg = baseDmgMod.modValue(dmg);
        if (needAdd)
            adddmg = baseDmgMod.modValue(adddmg);
        //子伤害 乘区
        if (isSubDamage) {
            dmg = modValue(dmg, dmgType, `受到${dmgType}`);
            if (needAdd)
                adddmg = modValue(adddmg, dmgType, `受到${dmgType}`);
        }
        //技伤和技能类别伤害 乘区
        let skillDmgMod = Modify_1.ModSet.addSet(sourceModTable.getModSet(`技能伤害`), targetModTable.getModSet(`受到技能伤害`));
        if (skillCategory != undefined)
            skillDmgMod = skillDmgMod.addSet(sourceModTable.getModSet(`${skillCategory}伤害`), targetModTable.getModSet(`受到${skillCategory}伤害`));
        dmg = skillDmgMod.modValue(dmg);
        if (needAdd)
            adddmg = skillDmgMod.modValue(adddmg);
        //范围类型伤害
        if (skillRange != undefined) {
            dmg = modValue(dmg, `${skillRange}伤害`, `受到${skillRange}伤害`);
            if (needAdd)
                adddmg = modValue(adddmg, `${skillRange}伤害`, `受到${skillRange}伤害`);
        }
        //暴击伤害
        if (this.hasSpecEffect("暴击特效")) {
            let critdmg = modValue(0, `暴击伤害`, `受到暴击伤害`);
            dmg = dmg * critdmg;
            if (needAdd)
                adddmg = adddmg * critdmg;
        }
        //合并附伤
        dmg += adddmg;
        //浮动 +-5%
        if (!this.hasSpecEffect("稳定特效"))
            dmg = dmg - (dmg * 0.05) + (Math.random() * dmg * 0.1);
        return Math.floor(dmg);
    }
    /**计算治疗或护盾 */
    calcOverHeal(target) {
        const { dmgCategory } = this.info;
        const targetModTable = target._buffTable.getModSetTable(this);
        const sourceModTable = this.calcSourceModSetTable();
        /**对数值进行增益  目标Set与来源Set加算
         * @param base       		基础值
         * @param flag       		标签
         * @param targetFlag 		目标的标签
         */
        function modValue(base, flag, targetFlag) {
            return Modify_1.ModSet.addSet(sourceModTable.getModSet(flag), targetModTable.getModSet(targetFlag)).modValue(base);
        }
        //基础系数
        let dmg = this.factor;
        //console.log("基础系数",this.factor)
        if (this.hasSpecEffect("固定特效"))
            return dmg;
        dmg = modValue(dmg, dmgCategory, `受到${dmgCategory}`);
        //暴击伤害
        if (this.hasSpecEffect("暴击特效")) {
            let critdmg = modValue(0, `暴击伤害`, `受到暴击伤害`);
            dmg = dmg * critdmg;
        }
        //浮动 +-5%
        if (!this.hasSpecEffect("稳定特效"))
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
function genDamageInfo(dmgCategory, dmgType, info) {
    const defnoskill = { skillType: "非技能" };
    const { ...skinfor } = info ? info : defnoskill;
    if (dmgType && dmgCategory == "所有伤害")
        return {
            dmgCategory,
            dmgType,
            ...skinfor
        };
    else if (dmgCategory != "所有伤害")
        return {
            dmgCategory,
            ...skinfor
        };
    throw "genDamageInfo 未知错误";
}
exports.genDamageInfo = genDamageInfo;
/**产生非技能伤害 */
function genNonSkillDamage(factor, dmgCategory, dmgType, char, ...specEffects) {
    return new Damage({ char: char }, factor, genDamageInfo(dmgCategory, dmgType), ...specEffects);
}
exports.genNonSkillDamage = genNonSkillDamage;
/**产生技能伤害 */
function genSkillDamage(factor, dmgCategory, dmgType, skillData, ...specEffects) {
    return new Damage({
        char: skillData?.user,
        skillData: skillData
    }, factor, genDamageInfo(dmgCategory, dmgType, skillData?.skill.info), ...specEffects);
}
exports.genSkillDamage = genSkillDamage;
