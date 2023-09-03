"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Andrea = void 0;
const _GenericBuff_1 = require("../../GenericBuff");
const Attack_1 = require("../../../Attack");
const Character_1 = require("../../../Character");
const Damage_1 = require("../../../Damage");
const DataTable_1 = require("../../../DataTable");
const Modify_1 = require("../../../Modify");
const Skill_1 = require("../../../Skill");
const Trigger_1 = require("../../../Trigger");
//const {skill,user,targetList,battlefield,buffTable,
//  isTriggerSkill,dataTable,uid}=skillData;
var Andrea;
(function (Andrea) {
    Andrea.极寒狙击 = {
        info: (0, Skill_1.genSkillInfo)("技能:极寒狙击", "冰霜技能", "伤害技能", "单体技能", "奥义技能"),
        cast(skillData) {
            (0, Skill_1.procSTSkill)(skillData, (data) => {
                const { skill, user, target, uid } = data;
                target.addBuff(Andrea.寒霜, target.getBuffStackCount(_GenericBuff_1.GenericBuff.极寒));
                let atk = (0, Attack_1.genAttack)(skillData, 3.6, "冰霜伤害", "伤害效果");
                target.getHit(atk);
            });
        }
    };
    Andrea.寒霜 = {
        info: (0, Modify_1.genBuffInfo)("效果:寒霜", "负面效果"),
        canSatck: true,
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:寒霜"),
                hook: "受攻击后",
                trigger(attack, victmin) {
                    if (attack.source.skillData.skill.info.skillName != "技能:极寒狙击")
                        return;
                    let count = victmin.getBuffStackCount(Andrea.寒霜);
                    let factor = count * (count * 0.0001 + 0.02);
                    let dmg = (0, Damage_1.genNonSkillDamage)(factor, "极寒伤害", "伤害效果", attack.source.char);
                    victmin.getHurt(dmg);
                },
            }]
    };
    Andrea.冷凝循环 = {
        info: (0, Skill_1.genSkillInfo)("技能:冷凝循环", "冰霜技能", "被动技能", "无范围技能", "秘术技能"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:冷凝循环"),
                hook: "攻击前",
                trigger(attack, victmin) {
                    let stack = victmin.getBuffStackCount(_GenericBuff_1.GenericBuff.极寒);
                    attack.source.char.addBuff(Andrea.冷凝循环效果, stack, 1);
                    if (stack >= 10)
                        attack.source.char.addBuff(Andrea.冷凝循环效果A, 1, 1);
                    return attack;
                },
            }]
    };
    Andrea.冷凝循环效果 = {
        info: (0, Modify_1.genBuffInfo)("效果:冷凝循环", "正面效果"),
        stackMultModify: {
            攻击: 0.015
        }
    };
    Andrea.冷凝循环效果A = {
        info: (0, Modify_1.genBuffInfo)("效果:冷凝循环A", "正面效果"),
        stackMultModify: {
            攻击: 0.1
        }
    };
    Andrea.冻寒标记 = {
        info: (0, Skill_1.genSkillInfo)("技能:冻寒标记", "无类型技能", "被动技能", "无范围技能", "特性技能"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:冻寒标记"),
                hook: "攻击前",
                trigger(attack, victmin) {
                    let stack = victmin.getBuffStackCount(_GenericBuff_1.GenericBuff.极寒);
                    attack.source.char.addBuff(Andrea.冻寒标记效果, stack);
                    return attack;
                },
            }]
    };
    Andrea.冻寒标记效果 = {
        info: (0, Modify_1.genBuffInfo)("效果:冻寒标记", "正面效果"),
        canSatck: true,
        stackLimit: 10,
        stackMultModify: {
            冰霜伤害: 0.03
        }
    };
    Andrea.baseStatus = {
        攻击: 10000
    };
    function genChar(name, status) {
        let opt = Object.assign({}, Andrea.baseStatus, status);
        let char = new Character_1.Character(name || "Andrea", opt);
        char.addSkill(Andrea.冷凝循环);
        char.addSkill(Andrea.冻寒标记);
        return char;
    }
    Andrea.genChar = genChar;
})(Andrea = exports.Andrea || (exports.Andrea = {}));
(0, DataTable_1.regDataTable)(Andrea);
