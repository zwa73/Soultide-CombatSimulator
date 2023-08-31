"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBattlefield = exports.Battlefield = exports.Formation = void 0;
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
    constructor() { }
    /**添加角色 */
    addCharacter(team, pos, ...chars) {
        this.teamMap[team][pos].push(...chars);
    }
    /**经过一回合
     * @returns 回合数
     */
    endRound() {
        for (let key in this.teamMap) {
            this.teamMap[key].getAllChars().forEach(char => char.endRound());
        }
        console.log("开始第", ++this.roundCount, "回合");
        return this.roundCount;
    }
}
exports.Battlefield = Battlefield;
exports.DefaultBattlefield = new Battlefield();
