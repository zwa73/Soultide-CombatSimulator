"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colcher = void 0;
const Skill_1 = require("../../../Skill");
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
        name: "状态:回音",
        tiggerList: [{
                hook: "释放技能后",
                weight: -1000,
                tigger(skillData) {
                    if (skillData.skill.info.skillName == "技能:王女的祝福")
                        return skillData;
                    if (skillData.isTiggerSkill)
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
