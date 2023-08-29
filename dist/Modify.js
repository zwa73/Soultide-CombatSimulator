"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefModTableSet = exports.DefModSet = exports.multModSet = exports.addModSet = exports.multModTableSet = exports.addModTableSet = exports.BuffTable = exports.matchCons = void 0;
/**判断 info 是否包含 target 的所有约束字段
 * cons 如不包含 "受击时" 或 "平常时" 则视为包含 "平常时"
 * @param isHurt 是受到攻击一方的buff 即匹配 "受击时" 约束 否则匹配 "平常时"
 * @param info   伤害信息
 * @param cons   约束列表
 */
function matchCons(isHurt = false, info, cons) {
    if (cons == null || cons.length <= 0)
        cons = [];
    //判断 "受击时" 或 "平常时"
    const hasHurtFlag = cons.some(con => {
        const orlist = Array.isArray(con) ? con : [con];
        return orlist.some(or => or.includes("受击时") || or.includes("平常时"));
    });
    //判断 hurtflag
    if (!hasHurtFlag)
        cons = [...cons, "平常时"];
    //展开info
    let infos = [];
    if (info != null)
        Object.values(info).forEach(element => infos.push(element));
    if (isHurt)
        infos.push("受击时");
    else
        infos.push("平常时");
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
        if (this._table[buff.name] == null || buff.canSatck != true)
            this._table[buff.name] = { buff, stack, duration };
        else {
            let stakcbuff = this._table[buff.name];
            stakcbuff.stack += stack;
            if (buff.stackLimit != null && stakcbuff.stack > buff.stackLimit)
                stakcbuff.stack = buff.stackLimit;
        }
        this.checkBuff(buff);
    }
    /**获取一个Buff的层数 */
    getBuffStack(buff) {
        let key = buff.name;
        if (this._table[key] == null || this._table[key].stack <= 0)
            return 0;
        return this._table[key].stack;
    }
    /**获取一个Buff */
    getBuff(key) {
        return this._table[key].buff;
    }
    /**获取buff持续时间 */
    getBuffDuration(buff) {
        let key = buff.name;
        if (this._table[key] == null || this._table[key].duration <= 0)
            return 0;
        return this._table[key].duration;
    }
    /**是否含有某个有效的buff */
    hasBuff(buff) {
        return this.getBuffStack(buff) > 0 && this.getBuffDuration(buff) > 0;
    }
    /**检查buff是否有效 无效则移除*/
    checkBuff(buff) {
        let stackBuff = this._table[buff.name];
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
        this._table[buff.name].stack = 0;
        this._table[buff.name].duration = 0;
        delete this._table[buff.name];
    }
    /**获取某个计算完增益的属性
     * @param base       基础值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    modValue(base, field, isHurt, damageInfo) {
        let modset = this.getModSet(field, isHurt, damageInfo);
        return (base + modset.add) * modset.mult;
    }
    /**获取某个属性的调整值
     * @param field      所要应用的调整字段
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModSet(field, isHurt, damageInfo) {
        let mult = 1;
        let add = 0;
        for (let buffName in this._table) {
            let stackData = this._table[buffName];
            let buff = stackData.buff;
            let stack = stackData.stack;
            if (buff.damageCons != null && matchCons(isHurt, damageInfo, buff.damageCons))
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
    /**获取伤害约束的Buff调整值表
     * @param isHurt     是受到攻击触发的buff
     * @param damageInfo 伤害信息
     */
    getModTableSet(isHurt, damageInfo) {
        //计算伤害约束的buff
        const vaildList = Object.values(this._table)
            .filter(item => matchCons(isHurt, damageInfo, item.buff.damageCons));
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
    /**获取所有对应触发器 */
    getTiggers(hook) {
        //触发器数组
        let arr = [];
        for (const key in this._table) {
            let obj = this._table[key];
            if (!this.hasBuff(obj.buff))
                continue;
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
