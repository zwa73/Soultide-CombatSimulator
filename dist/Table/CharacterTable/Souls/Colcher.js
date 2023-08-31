"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colcher = void 0;
const DataTable_1 = require("../../../DataTable");
const Modify_1 = require("../../../Modify");
const Skill_1 = require("../../../Skill");
const Trigger_1 = require("../../../Trigger");
var Colcher;
(function (Colcher) {
    Colcher.王女的祝福 = {
        info: (0, Skill_1.genSkillInfo)("技能:王女的祝福", "魔法技能", "辅助技能", "单体技能", "奥义技能"),
        cost: 64,
        cast(skillData) {
            const { user, targetList } = skillData;
            (0, Skill_1.checkTargets)(targetList, 1, 1);
            targetList[0].addBuff(Colcher.回音, 1, 2);
        }
    };
    Colcher.回音 = {
        info: (0, Modify_1.genBuffInfo)("效果:回音", "正面效果"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:回音"),
                hook: "释放技能后",
                weight: -Infinity,
                trigger(skillData) {
                    if (skillData.skill.info.skillName == "技能:王女的祝福")
                        return skillData;
                    if (skillData.isTriggerSkill)
                        return skillData;
                    if (skillData.skill.info.skillCategory != "奥义技能")
                        return skillData;
                    skillData.user.buffTable.removeBuff(Colcher.回音);
                    skillData.user.tiggerSkill(skillData.skill, skillData.targetList);
                    return skillData;
                }
            }]
    };
})(Colcher = exports.Colcher || (exports.Colcher = {}));
(0, DataTable_1.regDataTable)(Colcher);
