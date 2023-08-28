"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aurora = void 0;
const Skill_1 = require("./Skill");
var Aurora;
(function (Aurora) {
    Aurora.失心童话 = {
        info: (0, Skill_1.genSkillInfo)("技能:失心童话", "雷电技能", "伤害技能", "单体", "奥义"),
        cast(skillData) {
            const { user, targetList } = skillData;
            (0, Skill_1.checkTargets)(targetList, 1, 1);
            user.addBuff(噩廻, user.dynmaicStatus.当前怒气, 1);
            user.dynmaicStatus.当前怒气 = 0;
            let atk = (0, Skill_1.genAttack)(this, skillData, 1, "雷电");
            for (let i = 0; i < 3; i++)
                targetList[0].getHit(atk);
        }
    };
    const 噩廻 = {
        name: "噩廻",
        canSatck: true,
        stackMultModify: {
            攻击: 0.002,
        },
        stackAddModify: {
            伤害系数: 0.03,
        },
        damageConstraint: ["奥义", "雷电技能"],
    };
})(Aurora = exports.Aurora || (exports.Aurora = {}));
