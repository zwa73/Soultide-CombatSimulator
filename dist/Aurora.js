"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aurora = void 0;
const Skill_1 = require("./Skill");
var Aurora;
(function (Aurora) {
    Aurora.失心童话 = {
        info: (0, Skill_1.genSkillInfo)("雷电技能", "单体", "奥义"),
        use(skillData) {
            const { user } = skillData;
            user.addBuff(噩廻, user.dynmaicStatus.energy);
            user.dynmaicStatus.energy = 0;
            user.useSkill(Aurora.失心童话Sub, skillData.target);
        }
    };
    Aurora.失心童话Sub = {
        info: (0, Skill_1.genSkillInfo)("雷电技能", "单体", "奥义"),
        use(skillData) {
            let atk = (0, Skill_1.genAttack)(this.info, skillData, 1, "雷电");
            for (let i = 0; i < 3; i++)
                skillData.target[0].getHit(atk);
        }
    };
    const 噩廻 = {
        name: "噩廻",
        canSatck: true,
        stackModifyOnDamages: [{
                number: 0.03,
                modifyType: "伤害系数",
                constraint: ["奥义", "雷电技能"],
            }, {
                number: 0.002,
                modifyType: "攻击力",
                constraint: ["奥义", "雷电技能"],
            }]
    };
})(Aurora = exports.Aurora || (exports.Aurora = {}));
