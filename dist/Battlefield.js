"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBattlefield = exports.Battlefield = exports.Formation = void 0;
const _1 = require(".");
/**队形 */
class Formation {
    /**前排 */
    forward = [];
    /**后排 */
    backward = [];
    constructor() { }
    ;
    /**获取前排 */
    getForward() {
        if (this.forward.length > 0)
            return this.forward;
        return this.backward;
    }
    /**获取后排 */
    getBackward() {
        if (this.backward.length > 0)
            return this.backward;
        return this.forward;
    }
    /**获取全部角色 */
    getAllChars() {
        return this.forward.concat(this.backward);
    }
    /**含有任何角色 */
    hasAnyCharacter() {
        return this.forward.length > 0 || this.backward.length > 0;
    }
    /**含有角色 */
    hasCharacter(char) {
        if (this.forward.includes(char) ||
            this.backward.includes(char))
            return true;
        return false;
    }
}
exports.Formation = Formation;
/**战场 */
class Battlefield {
    teamMap = {
        A: new Formation(),
        B: new Formation(),
    };
    roundCount = 1;
    isStart = false;
    constructor() { }
    /**添加角色 */
    addCharacter(team, pos, ...chars) {
        this.teamMap[team][pos].push(...chars);
    }
    /**触发 回合结束前 触发器 */
    roundEndBefore() {
        let endRoundT = [];
        for (let key in this.teamMap) {
            this.teamMap[key].getAllChars()
                .forEach(char => endRoundT
                .push(...char.getRoundEndBeforeT()
                .map(t => { return { char, t }; })));
        }
        endRoundT.sort(_1.TriggerSort)
            .forEach(item => item.t.trigger(this.roundCount, item.char));
    }
    /**触发 回合开始后 触发器 */
    roundStartAfter() {
        let endRoundT = [];
        for (let key in this.teamMap) {
            this.teamMap[key].getAllChars()
                .forEach(char => endRoundT
                .push(...char.getRoundStartAfterT()
                .map(t => { return { char, t }; })));
        }
        endRoundT.sort(_1.TriggerSort)
            .forEach(item => item.t.trigger(this.roundCount, item.char));
    }
    /**经过一回合
     * @returns 回合数
     */
    endRound() {
        //结束前
        this.roundEndBefore();
        //结算回合
        for (let key in this.teamMap)
            this.teamMap[key].getAllChars().forEach(char => char.endRound(this.roundCount));
        console.log("结束第", this.roundCount, "回合");
        console.log();
        console.log("开始第", ++this.roundCount, "回合");
        //开始后
        this.roundStartAfter();
        return this.roundCount;
    }
    /**进行一回合 */
    round(func) {
        if (!this.isStart)
            this.startBattle();
        if (func)
            func();
        this.endRound();
    }
    /**触发 战斗开始后 触发器 */
    battleStartAfter() {
        let endRoundT = [];
        for (let key in this.teamMap) {
            this.teamMap[key].getAllChars()
                .forEach(char => endRoundT
                .push(...char.getBattleStartT()
                .map(t => { return { char, t }; })));
        }
        endRoundT.sort(_1.TriggerSort)
            .forEach(item => item.t.trigger(item.char));
    }
    /**战斗开始时 */
    startBattle() {
        console.log("战斗开始");
        //战斗开始后
        this.battleStartAfter();
        this.isStart = true;
        console.log("开始第", this.roundCount, "回合");
        //回合开始后
        this.roundStartAfter();
    }
}
exports.Battlefield = Battlefield;
exports.DefaultBattlefield = new Battlefield();
