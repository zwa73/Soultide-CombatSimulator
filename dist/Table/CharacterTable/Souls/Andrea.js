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
                target.addBuff(Andrea.寒霜, target.getBuffStackCountAndT(_GenericBuff_1.GenericBuff.极寒));
                let atk = (0, Attack_1.genAttack)(skillData, 3.6, "冰霜伤害");
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
                trigger(victmin, attack) {
                    if (attack.source.skillData.skill.info.skillName != "技能:极寒狙击")
                        return;
                    let count = victmin.getBuffStackCountAndT(Andrea.寒霜);
                    let factor = count * (count * 0.0001 + 0.02);
                    let dmg = (0, Damage_1.genNonSkillDamage)(factor, "极寒伤害", attack.source.char);
                    victmin.getHurt(dmg);
                },
            }]
    };
    Andrea.baseStatus = {
        攻击: 10000
    };
    function genChar(name, status) {
        let opt = Object.assign({}, Andrea.baseStatus, status);
        let char = new Character_1.Character(name || "Andrea", opt);
        return char;
    }
    Andrea.genChar = genChar;
})(Andrea = exports.Andrea || (exports.Andrea = {}));
(0, DataTable_1.regDataTable)(Andrea);
