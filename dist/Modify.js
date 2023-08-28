"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffTable = exports.matchCons = exports.ModifyTypeList = void 0;
const Damage_1 = require("./Damage");
const Skill_1 = require("./Skill");
/**所有可能的加成类型枚举 */
exports.ModifyTypeList = [];
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}附伤`));
Skill_1.SkillCategoryList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
exports.ModifyTypeList.push("技能伤害", "暴击伤害", "攻击", "所有伤害", "伤害系数");
/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
function matchCons(isHurt, info, cons) {
    let infos = [];
    Object.values(info).forEach(element => infos.push(element));
    if (isHurt)
        infos.push("受攻击时");
    //遍历约束
    for (let con of cons)
        if (!infos.includes(con))
            return false;
    return true;
}
exports.matchCons = matchCons;
/**buff表 */
class BuffTable {
    _table = {};
    constructor() { }
    /**添加一个Buff */
    addBuff(buff, stack, countdown) {
        if (this._table[buff.name] == null || buff.canSatck != true)
            this._table[buff.name] = { buff, stack, duration: countdown };
        else {
            let cadd = this._table[buff.name];
            cadd.stack += stack;
        }
    }
    /**获取一个Buff的层数 */
    getBuffStack(key) {
        if (this._table[key] == null || this._table[key].stack <= 0)
            return 0;
        return this._table[key].stack;
    }
    /**获取buff持续时间 */
    getBuffDuration(key) {
        if (this._table[key] == null || this._table[key].duration <= 0)
            return 0;
        return this._table[key].duration;
    }
    /**是否含有某个有效的buff */
    hasBuff(key) {
        return this.getBuffStack(key) > 0 && this.getBuffDuration(key) > 0;
    }
    /**结算回合 */
    endRound() {
        for (let k in this._table) {
            let buff = this._table[k];
            if (buff.duration > 0)
                buff.duration -= 1;
            if (buff.duration <= 0)
                this.removeBuff(k);
        }
    }
    /**移除某个buff */
    removeBuff(key) {
        this._table[key].stack = 0;
        this._table[key].duration = 0;
    }
    /**获取某个计算完增益的属性 不包含伤害约束属性
     * @param base  基础值
     * @param field 所要应用的调整字段
     */
    getStaticStatus(base, field) {
        let mult = 1;
        let add = 0;
        for (let buffName in this._table) {
            let stackData = this._table[buffName];
            let buff = stackData.buff;
            let stack = stackData.stack;
            if (buff.damageConstraint != null)
                continue;
            if (buff.multModify)
                mult += buff.multModify[field] || 0;
            if (buff.stackMultModify)
                mult += stack * (buff.stackMultModify[field] || 0);
            if (buff.addModify)
                add += buff.addModify[field] || 0;
            if (buff.stackAddModify)
                add += stack * (buff.stackAddModify[field] || 0);
        }
        return (base + add) * mult;
    }
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getDamageConsModTable(isHurt, damageInfo) {
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item => item.buff.damageConstraint &&
            matchCons(isHurt, damageInfo, item.buff.damageConstraint));
        const multModTable = {};
        const addModTable = {};
        //叠加乘区
        function stackArean(baseMap, modMap, stack) {
            for (let flag of Object.keys(modMap)) {
                if (baseMap[flag] == null)
                    baseMap[flag] = 1;
                baseMap[flag] += modMap[flag] * stack;
            }
        }
        for (const item of vaildList) {
            const basedMultTable = item.buff.multModify || {};
            const stackMultTable = item.buff.stackMultModify || {};
            const basedAddTable = item.buff.addModify || {};
            const stackAddTable = item.buff.stackAddModify || {};
            const stack = item.stack;
            //叠加同乘区
            stackArean(multModTable, basedMultTable, 1);
            stackArean(multModTable, stackMultTable, stack);
            stackArean(addModTable, basedAddTable, 1);
            stackArean(addModTable, stackAddTable, stack);
        }
        return {
            /**倍率调整表 */
            multModTable: multModTable,
            /**加值调整表 */
            addModTable: addModTable
        };
    }
    /**获取所有对应触发器 */
    getTiggers(hook) {
        //触发器数组
        let arr = [];
        for (const key in this._table) {
            if (!this.hasBuff(key))
                continue;
            let obj = this._table[key];
            if (obj.buff.tiggerList == null)
                continue;
            for (const tigger of obj.buff.tiggerList) {
                if (tigger.hook == hook)
                    arr.push(tigger);
            }
        }
        arr.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        return arr;
    }
    clone() {
        let nbuff = new BuffTable();
        for (let i in this._table) {
            nbuff._table[i].buff = this._table[i].buff;
            nbuff._table[i].stack = this._table[i].stack;
        }
        return nbuff;
    }
}
exports.BuffTable = BuffTable;
;
