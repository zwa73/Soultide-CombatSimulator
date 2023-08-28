"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBattlefield = exports.Battlefield = exports.Formation = exports.Character = void 0;
const utils = require("@zwa73/utils");
/**角色 */
class Character {
    /**角色处在的战场 */
    battlefield = exports.DefaultBattlefield;
    /**角色的静态属性 */
    staticStatus;
    /**角色的当前属性 */
    dynmaicStatus;
    /**所有的附加状态 */
    buffTable = {};
    constructor({ maxHealth = 1, attack = 0, speed = 0, defense = 0, critRate = 0.05, critDamage = 1.5, startEnergy = 0, dodge = 0 }) {
        this.staticStatus = { maxHealth, attack, speed, defense,
            critRate, critDamage, startEnergy, dodge };
        this.dynmaicStatus = {
            health: maxHealth,
            energy: startEnergy,
        };
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field) {
        let modify = 1;
        for (let key in this.buffTable) {
            let stackData = this.buffTable[key];
            let buff = stackData.buff;
            if (buff.statusMultModify)
                modify += buff.statusMultModify[field] || 0;
            if (buff.stackStatausMultModify && stackData.stackCount)
                modify += stackData.stackCount * (buff.stackStatausMultModify[field] || 0);
        }
        return this.staticStatus[field] * modify;
    }
    /**获取所有对应触发器 */
    getTiggers(hook) {
        //触发器数组
        let arr = [];
        for (const obj of Object.values(this.buffTable)) {
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
    addBuff(buff, stackCount) {
        if (this.buffTable[buff.name] == null || buff.canSatck != true)
            this.buffTable[buff.name] = { buff, stackCount };
        else {
            let cadd = this.buffTable[buff.name];
            cadd.stackCount += stackCount;
        }
    }
    /**获取所有伤害时生效的增益 */
    getOnDamageModify() {
        let list = [];
        for (let key in this.buffTable) {
            let stackData = this.buffTable[key];
            let buff = stackData.buff;
            if (buff.modifyOnDamages != null) {
                buff.modifyOnDamages.forEach(item => list.push({
                    mod: item,
                    stack: 1,
                }));
            }
            if (buff.stackModifyOnDamages != null && stackData.stackCount != null) {
                let num = stackData.stackCount;
                buff.stackModifyOnDamages.forEach(item => list.push({
                    mod: item,
                    stack: num,
                }));
            }
        }
        return list;
    }
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     */
    useSkill(skill, target) {
        let skillData = {
            user: this,
            target: target,
            battlefield: this.battlefield,
        };
        this.getTiggers("UseSkillAfter").forEach(t => skillData = t.tigger(skillData));
        skill.use(skillData);
        this.getTiggers("UseSkillBefore").forEach(t => skillData = t.tigger(skillData));
    }
    /**受到伤害 */
    getHurt(damage) {
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.health -= dmg;
        console.log(dmg);
    }
    /**受到攻击 */
    getHit(attack) {
        let dmg = attack.calcDamage();
        this.getHurt(dmg);
    }
    /**克隆角色 */
    clone() {
        return new Character(utils.deepClone(this.staticStatus));
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
