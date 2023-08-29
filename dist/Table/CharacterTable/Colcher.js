"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colcher = void 0;
const Skill_1 = require("../../Skill");
var Colcher;
(function (Colcher) {
    Colcher.王女的祝福 = {
        info: (0, Skill_1.genSkillInfo)("技能:王女的祝福", "魔法技能", "其他技能", "单体", "奥义"),
        cast(skillData) {
            const { user, targetList } = skillData;
            (0, Skill_1.checkTargets)(targetList, 1, 1);
            targetList[0].addBuff(Colcher.回音, 1, 2);
        }
    };
    Colcher.回音 = {
        name: "回音",
        tiggerList: [{
                hook: "释放技能后",
                tigger(skillData) {
                    if (skillData.skill.info.skillName == "技能:王女的祝福")
                        return skillData;
                    skillData.user.buffTable.removeBuff(Colcher.回音.name);
                    skillData.user.tiggerSkill(skillData.skill, skillData.targetList);
                    return skillData;
                }
            }]
    };
})(Colcher = exports.Colcher || (exports.Colcher = {}));
