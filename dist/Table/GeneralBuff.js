"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colcher = void 0;
var Colcher;
(function (Colcher) {
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
