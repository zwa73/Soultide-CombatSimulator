"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModSetTable = exports.ModSet = exports.BuffTable = exports.genBuffInfo = exports.matchCons = void 0;
const utils_1 = require("@zwa73/utils");
/**判断 info 是否包含 target 的所有约束字段
 * @param info   伤害信息
 * @param cons   约束列表
 */
function matchCons(info, cons) {
    if (cons == null || cons.length <= 0)
        cons = [];
    //展开info
    let infos = [];
    if (info != null)
        Object.values(info).forEach(element => infos.push(element));
    //遍历约束 判断infos是否包含所有的And
    for (let con of cons) {
        let orlist = Array.isArray(con) ? con : [con];
        //判断infos是否包含任意的Or
        for (let or of orlist) {
            if (infos.includes(or))
                continue;
            return false;
        }
    }
    return true;
}
exports.matchCons = matchCons;
function genBuffInfo(buffName, buffType) {
    return { buffName, buffType };
}
exports.genBuffInfo = genBuffInfo;
/**buff表 */
class BuffTable {
    _table = {};
    constructor() { }
    /**添加一个buff
     * @deprecated 这个函数仅供Character.addBuff 或内部调用
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff, stack = 1, duration = Infinity) {
        if (this._table[buff.info.buffName] == null || buff.canSatck != true)
            this._table[buff.info.buffName] = { buff, stack, duration };
        else {
            let stakcbuff = this._table[buff.info.buffName];
            stakcbuff.stack += stack;
            if (buff.stackLimit != null && stakcbuff.stack > buff.stackLimit)
                stakcbuff.stack = buff.stackLimit;
        }
        this.checkBuff(buff);
    }
    /**获取一个Buff的层数 不会触发触发器
     * @deprecated 这个函数仅供Character.getBuffStackCountWithoutT 或内部调用
     */
    getBuffStackCount(buff) {
        let bs = this.getBuffStack(buff);
        if (bs == null || bs.stack <= 0)
            return 0;
        return bs.stack;
    }
    /**获取一个Buff
     * @deprecated 这个函数仅供Character.getBaseStatus调用
     */
    getBuff(key) {
        return this._table[key]?.buff;
    }
    /**获取buff持续时间 */
    getBuffDuration(buff) {
        let bs = this.getBuffStack(buff);
        if (bs == null || bs.duration <= 0)
            return 0;
        return bs.duration;
    }
    /**获取BuffStack */
    getBuffStack(buff) {
        return this._table[buff.info.buffName];
    }
    /**是否含有某个有效的buff */
    hasBuff(buff) {
        return this.getBuffStackCount(buff) > 0 && this.getBuffDuration(buff) > 0;
    }
    /**检查buff是否有效 无效则移除*/
    checkBuff(buff) {
        let stackBuff = this._table[buff.info.buffName];
        if (stackBuff == null)
            return false;
        //console.log("stackBuff",stackBuff.buff.info.buffName,stackBuff.duration,stackBuff.stack)
        if (stackBuff.duration <= 0) {
            this.removeBuff(stackBuff.buff);
            return false;
        }
        if (stackBuff.stack <= 0) {
            this.removeBuff(stackBuff.buff);
            return false;
        }
        return true;
    }
    /**结算回合 */
    endRound() {
        for (let k in this._table) {
            let stackbuff = this._table[k];
            if (stackbuff == null)
                continue;
            if (stackbuff.duration > 0)
                stackbuff.duration -= 1;
            this.checkBuff(stackbuff.buff);
        }
    }
    /**移除某个buff */
    removeBuff(buff) {
        let bs = this.getBuffStack(buff);
        if (bs == null)
            return;
        bs.stack = 0;
        bs.duration = 0;
        delete bs["dataTable"];
        delete this._table[buff.info.buffName];
    }
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param damageInfo 伤害信息
     */
    modValue(base, field, damageInfo) {
        let modset = this.getModSet(field, damageInfo);
        return modset.modValue(base);
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param damageInfo 伤害信息
     */
    getModSet(field, damageInfo) {
        let mult = 1;
        let add = 0;
        for (let buffName in this._table) {
            let stackData = this._table[buffName];
            if (stackData == null)
                continue;
            let buff = stackData.buff;
            let stack = stackData.stack;
            if (buff.damageCons != null && matchCons(damageInfo, buff.damageCons))
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
        return new ModSet(add, mult);
    }
    /**获取伤害约束的Buff调整值表 不会触发触发器
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSetTable(damageInfo) {
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item => matchCons(damageInfo, item?.buff.damageCons));
        //console.log("vaildList",vaildList)
        const multModTable = {};
        const addModTable = {};
        //叠加乘区
        function stackMultArean(baseMap, modMap, stack) {
            for (let flag of Object.keys(modMap)) {
                if (baseMap[flag] == null)
                    baseMap[flag] = 1;
                baseMap[flag] += modMap[flag] * stack;
            }
        }
        function stackAddArean(baseMap, modMap, stack) {
            for (let flag of Object.keys(modMap)) {
                if (baseMap[flag] == null)
                    baseMap[flag] = 0;
                baseMap[flag] += modMap[flag] * stack;
            }
        }
        for (const item of vaildList) {
            if (item == null)
                continue;
            const basedMultTable = item.buff.multModify || {};
            const stackMultTable = item.buff.stackMultModify || {};
            const basedAddTable = item.buff.addModify || {};
            const stackAddTable = item.buff.stackAddModify || {};
            const stack = item.stack;
            //叠加同乘区
            stackMultArean(multModTable, basedMultTable, 1);
            stackMultArean(multModTable, stackMultTable, stack);
            stackAddArean(addModTable, basedAddTable, 1);
            stackAddArean(addModTable, stackAddTable, stack);
        }
        //console.log("addModTable",addModTable)
        return new ModSetTable(addModTable, multModTable);
    }
    /**获取buffTable中所有对应触发器 不包括全局触发器
     * @deprecated 这个函数仅供Character.getTiggers 或内部调用
     */
    getTriggers(hook) {
        //触发器数组
        let arr = [];
        for (const key in this._table) {
            let bs = this._table[key];
            if (bs == null)
                continue;
            if (!this.hasBuff(bs.buff))
                continue;
            if (bs.buff.triggerList == null)
                continue;
            for (const tigger of bs.buff.triggerList) {
                if (tigger.hook == hook)
                    arr.push(tigger);
            }
        }
        arr.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        return arr;
    }
    clone() {
        let nbuff = new BuffTable();
        for (let key in this._table) {
            let bn = key;
            let bs = this._table[bn];
            if (bs == null)
                continue;
            const { dataTable, ...rest } = bs;
            let nbs = {
                ...rest,
                dataTable: {}
            };
            nbuff._table[bn] = nbs;
        }
        return nbuff;
    }
}
exports.BuffTable = BuffTable;
;
/**对某个属性的调整组 */
class ModSet {
    add;
    mult;
    constructor(add = 0, mult = 1) {
        this.add = add;
        this.mult = mult;
    }
    /**对某个值进行增益 */
    modValue(base) {
        return (base + this.add) * this.mult;
    }
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    addSet(...sets) {
        return ModSet.addSet(this, ...sets);
    }
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    multSet(...sets) {
        return ModSet.multSet(this, ...sets);
    }
    /**将多个ModSet相加
     * 加值相加 倍率相加
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static addSet(...sets) {
        let add = 0;
        let mult = 1;
        for (let set of sets) {
            add += set.add;
            mult += (set.mult - 1);
        }
        return new ModSet(add, mult);
    }
    /**将多个ModSet相乘
     * 加值相加 倍率相乘
     * @param sets ModSet组
     * @returns 新的ModSet
     */
    static multSet(...sets) {
        let add = 0;
        let mult = 1;
        for (let set of sets) {
            add += set.add;
            mult *= set.mult;
        }
        return new ModSet(add, mult);
    }
    toJSON() {
        return { add: this.add, mult: this.mult };
    }
}
exports.ModSet = ModSet;
/**累加的 对所有属性的调整组表 */
class ModSetTable {
    addTable;
    multTable;
    constructor(addTable, multTable) {
        this.addTable = addTable || {};
        this.multTable = multTable || {};
    }
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    addSet(...sets) {
        return ModSetTable.addSet(this, ...sets);
    }
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    multSet(...sets) {
        return ModSetTable.multSet(this, ...sets);
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     */
    getModSet(field) {
        return new ModSet(this.addTable[field], this.multTable[field]);
    }
    /**对 ModSetTable 进行加运算 乘区加算 加值加算*/
    static addSet(...sets) {
        const outset = new ModSetTable();
        for (let set of sets)
            ModSetTable.addTableSet(outset, set);
        return outset;
    }
    /**对 ModSetTable 进行乘运算 乘区乘算 加值加算*/
    static multSet(...sets) {
        const outset = new ModSetTable();
        for (let set of sets)
            ModSetTable.multTableSet(outset, set);
        return outset;
    }
    static multTableSet(baseSet, modSet) {
        ModSetTable.multMultTable(baseSet.multTable, modSet.multTable);
        ModSetTable.addAddTable(baseSet.addTable, modSet.addTable);
    }
    static addTableSet(baseSet, modSet) {
        ModSetTable.addMultTable(baseSet.multTable, modSet.multTable);
        ModSetTable.addAddTable(baseSet.addTable, modSet.addTable);
    }
    static addAddTable(baseTable, modTable) {
        for (let flag of Object.keys(modTable)) {
            if (baseTable[flag] == null)
                baseTable[flag] = 0;
            baseTable[flag] += modTable[flag];
        }
    }
    static addMultTable(baseTable, modTable) {
        for (let flag of Object.keys(modTable)) {
            if (baseTable[flag] == null)
                baseTable[flag] = 1;
            baseTable[flag] += (modTable[flag] - 1);
        }
    }
    static multMultTable(baseTable, modTable) {
        for (let flag of Object.keys(modTable)) {
            if (baseTable[flag] == null)
                baseTable[flag] = 1;
            baseTable[flag] *= modTable[flag];
        }
    }
    toJSON() {
        return {
            addTable: (0, utils_1.deepClone)(this.addTable),
            multTable: (0, utils_1.deepClone)(this.multTable)
        };
    }
}
exports.ModSetTable = ModSetTable;
