"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBattlefield = exports.Battlefield = exports.Formation = exports.Character = void 0;
const utils = require("@zwa73/utils");
const Modify_1 = require("./Modify");
const Status_1 = require("./Status");
/**角色 */
class Character {
    /**角色名称 */
    name;
    /**角色处在的战场 */
    battlefield = exports.DefaultBattlefield;
    /**角色的静态属性 */
    staticStatus;
    /**角色的当前属性 */
    dynmaicStatus;
    /**所有的附加状态 */
    buffTable = new Modify_1.BuffTable();
    constructor(name, opt) {
        this.name = name;
        this.staticStatus = Object.assign({}, Status_1.DefStaticStatus, opt);
        this.dynmaicStatus = {
            当前生命: this.staticStatus.最大生命,
            当前怒气: this.staticStatus.初始怒气,
        };
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field) {
        let mod = this.buffTable.getStaticStatus(this.staticStatus[field], field);
        return mod;
    }
    /**添加一个buff */
    addBuff(buff, stack = 1) {
        this.buffTable.addBuff(buff, stack);
    }
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill, target, isTiggerSkill = false) {
        let skillData = {
            skill: skill,
            user: this,
            targetList: target,
            battlefield: this.battlefield,
            buffTable: new Modify_1.BuffTable(),
            isTiggerSkill: isTiggerSkill
        };
        skill.beforeCast ? skill.beforeCast(skillData) : undefined;
        this.buffTable.getTiggers("释放技能前").forEach(t => skillData = t.tigger(skillData));
        skill.cast(skillData);
        this.buffTable.getTiggers("释放技能后").forEach(t => skillData = t.tigger(skillData));
        skill.afterCast ? skill.afterCast(skillData) : undefined;
    }
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    tiggerSkill(skill, target) {
        this.useSkill(skill, target, true);
    }
    /**受到伤害 */
    getHurt(damage) {
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.当前生命 -= dmg;
        console.log(this.name + " 受到", dmg, "点伤害");
    }
    /**受到攻击 */
    getHit(attack) {
        let dmg = attack.calcDamage();
        this.getHurt(dmg);
    }
    /**克隆角色 */
    clone() {
        return new Character(this.name, utils.deepClone(this.staticStatus));
    }
}
exports.Character = Character;
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
