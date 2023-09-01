"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const utils = require("@zwa73/utils");
const Battlefield_1 = require("./Battlefield");
const Damage_1 = require("./Damage");
const Modify_1 = require("./Modify");
const Status_1 = require("./Status");
const DataTable_1 = require("./DataTable");
/**角色 */
class Character {
    /**角色名称 */
    name;
    /**角色处在的战场 */
    battlefield = Battlefield_1.DefaultBattlefield;
    /**角色的当前属性 */
    dynmaicStatus;
    /**所有的附加状态 */
    buffTable = new Modify_1.BuffTable();
    /**所有的技能 */
    skillTable = {};
    /**额外数据表 */
    dataTable = {};
    constructor(name, status) {
        this.name = name;
        let staticStatus = Object.assign({}, Status_1.DefStaticStatus, status);
        let baseBuff = {
            info: (0, Modify_1.genBuffInfo)((name + "基础属性"), "其他效果"),
            addModify: staticStatus
        };
        //console.log(name,"staticStatus",staticStatus)
        this.addBuff(baseBuff);
        this.dynmaicStatus = {
            当前生命: staticStatus.最大生命 || 0,
            当前怒气: staticStatus.初始怒气 || 0,
        };
        Battlefield_1.DefaultBattlefield.addCharacter("A", "forward", this);
    }
    /**获取角色的基础属性 */
    getBaseStatus() {
        return this.buffTable.getBuff((this.name + "基础属性"));
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field, damage) {
        let mod = this.buffTable.modValue(0, field, damage);
        return mod;
    }
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill, target, skillDataOpt) {
        let skillData = {
            skill: skill,
            user: this,
            targetList: target,
            battlefield: this.battlefield,
            buffTable: new Modify_1.BuffTable(),
            isTriggerSkill: false,
            dataTable: {},
            uid: utils.genUUID()
        };
        skillData = Object.assign({}, skillData, skillDataOpt);
        console.log(this.name, "开始向", target.map(char => char.name), "释放", skillData.skill.info.skillName);
        skill.beforeCast ? skill.beforeCast(skillData) : undefined;
        this.getTriggers("释放技能前").forEach(t => skillData = t.trigger(skillData));
        //消耗怒气
        if (!skillData.isTriggerSkill)
            this.dynmaicStatus.当前怒气 -= skill.cost || 0;
        //产生效果
        if (skill.cast)
            skill.cast(skillData);
        this.getTriggers("释放技能后").forEach(t => t.trigger(skillData));
        skill.afterCast ? skill.afterCast(skillData) : undefined;
    }
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    triggerSkill(skill, target, skillDataOpt) {
        const triggeropt = {
            isTriggerSkill: true
        };
        let mergeOpt = Object.assign({}, triggeropt, skillDataOpt);
        console.log(this.name, "触发了", skill.info.skillName);
        this.useSkill(skill, target, mergeOpt);
    }
    /**结算回合 */
    endRound() {
        this.buffTable.endRound();
        this.dynmaicStatus.当前怒气 += this.getStaticStatus("怒气回复");
        let maxEnergy = this.getStaticStatus("最大怒气");
        if (this.dynmaicStatus.当前怒气 > maxEnergy)
            this.dynmaicStatus.当前怒气 = maxEnergy;
    }
    /**受到伤害 */
    getHurt(damage) {
        //造成伤害前
        if (damage.source.char) {
            let source = damage.source.char;
            let causeDBeforeT = [];
            causeDBeforeT.push(...(source.getTriggers("造成伤害前") || []));
            causeDBeforeT.push(...(source.getTriggers("造成技能伤害前") || []));
            causeDBeforeT.push(...(source.getTriggers("造成类型伤害前") || []));
            causeDBeforeT.sort((a, b) => (b.weight || 0) - (a.weight || 0))
                .forEach(t => {
                if ((t.hook == "造成技能伤害前" && damage.isSkillDamage()) ||
                    (t.hook == "造成类型伤害前" && (0, Modify_1.matchCons)(damage, t.damageCons)) ||
                    (t.hook == "造成伤害前"))
                    damage = t.trigger(damage, this);
            });
        }
        //计算伤害
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.当前生命 -= dmg;
        //造成伤害后
        if (damage.source.char) {
            let source = damage.source.char;
            let causeDAfterT = [];
            causeDAfterT.push(...(source.getTriggers("造成伤害后") || []));
            causeDAfterT.push(...(source.getTriggers("造成技能伤害后") || []));
            causeDAfterT.push(...(source.getTriggers("造成类型伤害后") || []));
            causeDAfterT.sort((a, b) => (b.weight || 0) - (a.weight || 0))
                .forEach(t => {
                if ((t.hook == "造成技能伤害后" && damage.isSkillDamage()) ||
                    (t.hook == "造成类型伤害后" && (0, Modify_1.matchCons)(damage, t.damageCons)) ||
                    (t.hook == "造成伤害后"))
                    t.trigger(damage, this);
            });
        }
        //log
        let log = `${this.name} 受到`;
        let hasSource = false;
        if (damage.source.char != null) {
            hasSource = true;
            log += ` ${damage.source.char.name}`;
        }
        if (damage.source.skillData != null) {
            hasSource = true;
            log += ` ${damage.source.skillData.skill.info.skillName}`;
        }
        if (hasSource)
            log += " 造成的";
        console.log(log, dmg, "点", damage.info.dmgType, `${damage.hasSpecEffect(Damage_1.暴击) ? "暴击" : ""}`);
    }
    /**受到攻击击中 */
    getHit(attack) {
        this.getTriggers("受攻击前").forEach(t => attack = t.trigger(this, attack));
        let dmg = attack.calcDamage(this);
        this.getHurt(dmg);
        this.getTriggers("受攻击后").forEach(t => t.trigger(this, attack));
    }
    /**克隆角色 */
    clone() {
        let char = new Character(this.name, {});
        let bt = this.buffTable.clone();
        char.buffTable = bt;
        return char;
    }
    /**添加技能 同时加入技能的被动buff*/
    addSkill(skill) {
        this.skillTable[skill.info.skillName] = skill;
        if (skill.passiveList == null)
            return;
        for (let stackpe of skill.passiveList)
            this.addBuff(stackpe.buff, stackpe.stack, stackpe.duration);
    }
    /**获取所有对应触发器 包括全局触发器 技能触发器 */
    getTriggers(hook) {
        //触发器数组
        const tiggers = this.buffTable.getTriggers(hook);
        //全局触发器
        for (const key in DataTable_1.GlobalTiggerTable) {
            let tigger = DataTable_1.GlobalTiggerTable[key];
            if (tigger.hook == hook)
                tiggers.push(tigger);
        }
        //技能触发器
        for (const skillName in this.skillTable) {
            let skill = this.skillTable[skillName];
            if (skill.triggerList == null)
                continue;
            for (let tigger of skill.triggerList) {
                if (tigger.hook == hook)
                    tiggers.push(tigger);
            }
        }
        tiggers.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        return tiggers;
    }
    //———————————————————— util ————————————————————//
    /**获取一个Buff的层数 Get Buff Stack Count Without Trigger
     * @deprecated 这个函数不会触发"获取状态层数"触发器
     */
    getBuffStackCountNoT(buff) {
        return this.buffTable.getBuffStackCount(buff);
    }
    /**获取一个Buff的层数 并触发触发器 Get Buff Stack Count And Trigger*/
    getBuffStackCountAndT(buff) {
        let count = this.getBuffStackCountNoT(buff);
        this.getTriggers("获取效果层数后").forEach(t => count = t.trigger(this, buff, count));
        return count;
    }
    /**获取BuffStack */
    getBuffStack(buff) {
        return this.buffTable.getBuffStack(buff);
    }
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff, stack = 1, duration = Infinity) {
        return this.buffTable.addBuff(buff, stack, duration);
    }
    /**含有某个Buff
     * @param buff      buff
     */
    hasBuff(buff) {
        return this.buffTable.hasBuff(buff);
    }
}
exports.Character = Character;
