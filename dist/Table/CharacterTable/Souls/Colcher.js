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
            (0, Skill_1.procSTSkill)(skillData, (data) => {
                const { user, target } = data;
                target.addBuff(Colcher.回音, 1, 2);
            });
        }
    };
    Colcher.回音 = {
        info: (0, Modify_1.genBuffInfo)("效果:回音", "正面效果"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:回音"),
                hook: "释放技能后",
                weight: -Infinity,
                trigger(skillData) {
                    const { user, uid } = skillData;
                    if (uid != user.dataTable["回音技能注册"])
                        return;
                    skillData.user.removeBuff(Colcher.回音);
                    let bufftable = new Modify_1.BuffTable(skillData.user);
                    bufftable.addBuff({
                        info: (0, Modify_1.genBuffInfo)("效果:回音奥义伤害减少", "负面效果"),
                        multModify: {
                            奥义技能伤害: -0.4
                        }
                    });
                    skillData.user.triggerSkill(skillData.skill, skillData.targetList, {
                        buffTable: bufftable
                    });
                }
            }, {
                info: (0, Trigger_1.genTriggerInfo)("触发:回音注册技能"),
                hook: "释放技能前",
                weight: Infinity,
                trigger(skillData) {
                    const { user, uid, skill } = skillData;
                    if (skill.info.skillName == "技能:王女的祝福")
                        return skillData;
                    if (skill.info.skillCategory != "奥义技能")
                        return skillData;
                    if (user.dataTable["回音技能注册"] != null)
                        return skillData;
                    user.dataTable["回音技能注册"] = uid;
                    return skillData;
                }
            }]
    };
})(Colcher = exports.Colcher || (exports.Colcher = {}));
(0, DataTable_1.regDataTable)(Colcher);
