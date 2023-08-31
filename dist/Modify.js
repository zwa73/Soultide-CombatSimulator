"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefModTableSet = exports.DefModSet = exports.multModSet = exports.addModSet = exports.multModTableSet = exports.addModTableSet = exports.BuffTable = exports.genBuffInfo = exports.matchCons = void 0;
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
    getBuffStackCountWithoutT(buff) {
        let key = buff.info.buffName;
        if (this._table[key] == null || this._table[key].stack <= 0)
            return 0;
        return this._table[key].stack;
    }
    /**获取一个Buff
     * @deprecated 这个函数仅供Character.getBaseStatus调用
     */
    getBuff(key) {
        return this._table[key].buff;
    }
    /**获取buff持续时间 */
    getBuffDuration(buff) {
        let key = buff.info.buffName;
        if (this._table[key] == null || this._table[key].duration <= 0)
            return 0;
        return this._table[key].duration;
    }
    /**是否含有某个有效的buff */
    hasBuff(buff) {
        return this.getBuffStackCountWithoutT(buff) > 0 && this.getBuffDuration(buff) > 0;
    }
    /**检查buff是否有效 无效则移除*/
    checkBuff(buff) {
        let stackBuff = this._table[buff.info.buffName];
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
            if (stackbuff.duration > 0)
                stackbuff.duration -= 1;
            this.checkBuff(stackbuff.buff);
        }
    }
    /**移除某个buff */
    removeBuff(buff) {
        this._table[buff.info.buffName].stack = 0;
        this._table[buff.info.buffName].duration = 0;
        delete this._table[buff.info.buffName];
    }
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    modValue(base, field, damageInfo) {
        let modset = this.getModSet(field, damageInfo);
        return (base + modset.add) * modset.mult;
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSet(field, damageInfo) {
        let mult = 1;
        let add = 0;
        for (let buffName in this._table) {
            let stackData = this._table[buffName];
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
        return { add, mult };
    }
    /**获取伤害约束的Buff调整值表 不会触发触发器
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModTableSet(damageInfo) {
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item => matchCons(damageInfo, item.buff.damageCons));
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
        return {
            /**倍率调整表 */
            multModTable: multModTable,
            /**加值调整表 */
            addModTable: addModTable
        };
    }
    /**获取buffTable中所有对应触发器 不包括全局触发器*/
    getTiggers(hook) {
        //触发器数组
        let arr = [];
        for (const key in this._table) {
            let obj = this._table[key];
            if (!this.hasBuff(obj.buff))
                continue;
            if (obj.buff.triggerList == null)
                continue;
            for (const tigger of obj.buff.triggerList) {
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
            let bn = i;
            nbuff._table[bn].buff = this._table[bn].buff;
            nbuff._table[bn].stack = this._table[bn].stack;
        }
        return nbuff;
    }
}
exports.BuffTable = BuffTable;
;
function addAddTable(baseTable, modTable) {
    for (let flag of Object.keys(modTable)) {
        if (baseTable[flag] == null)
            baseTable[flag] = 0;
        baseTable[flag] += modTable[flag];
    }
}
function addMultTable(baseTable, modTable) {
    for (let flag of Object.keys(modTable)) {
        if (baseTable[flag] == null)
            baseTable[flag] = 1;
        baseTable[flag] += (modTable[flag] - 1);
    }
}
function multMultTable(baseTable, modTable) {
    for (let flag of Object.keys(modTable)) {
        if (baseTable[flag] == null)
            baseTable[flag] = 1;
        baseTable[flag] *= modTable[flag];
    }
}
function addTableSet(baseSet, modSet) {
    addMultTable(baseSet.multModTable, modSet.multModTable);
    addAddTable(baseSet.addModTable, modSet.addModTable);
}
function multTableSet(baseSet, modSet) {
    multMultTable(baseSet.multModTable, modSet.multModTable);
    addAddTable(baseSet.addModTable, modSet.addModTable);
}
/**对ModTableSet进行加运算 乘区加算 加值加算*/
function addModTableSet(...sets) {
    const outset = { addModTable: {}, multModTable: {} };
    for (let set of sets)
        addTableSet(outset, set);
    return outset;
}
exports.addModTableSet = addModTableSet;
/**对ModTableSet进行乘运算 乘区乘算 加值加算*/
function multModTableSet(...sets) {
    const outset = { addModTable: {}, multModTable: {} };
    for (let set of sets)
        multTableSet(outset, set);
    return outset;
}
exports.multModTableSet = multModTableSet;
function addModSet(...sets) {
    let baseSet = { add: 0, mult: 1 };
    for (let set of sets) {
        baseSet.add += set.add;
        baseSet.mult += (set.mult - 1);
    }
    return baseSet;
}
exports.addModSet = addModSet;
function multModSet(...sets) {
    let baseSet = { add: 0, mult: 1 };
    for (let set of sets) {
        baseSet.add += set.add;
        baseSet.mult *= set.mult;
    }
    return baseSet;
}
exports.multModSet = multModSet;
exports.DefModSet = { add: 0, mult: 1 };
exports.DefModTableSet = { addModTable: {}, multModTable: {} };
