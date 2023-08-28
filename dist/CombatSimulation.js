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
    /**含有角色 */
    hasCharacter() {
        return this.forward.length > 0 || this.backward.length > 0;
    }
}
exports.Formation = Formation;
/**战场 */
class Battlefield {
    teamMap = {
        A: new Formation(),
        B: new Formation(),
    };
    roundCount = 0;
    constructor() { }
    /**添加角色 */
    addCharacter(team, pos, ...chars) {
        this.teamMap[team][pos].push(...chars);
    }
    /**经过一回合 */
    nextRound() { return ++this.roundCount; }
}
exports.Battlefield = Battlefield;
exports.DefaultBattlefield = new Battlefield();
