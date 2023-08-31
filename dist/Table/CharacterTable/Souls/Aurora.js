"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aurora = void 0;
const Character_1 = require("../../../Character");
const DataTable_1 = require("../../../DataTable");
const Modify_1 = require("../../../Modify");
const Skill_1 = require("../../../Skill");
const Trigger_1 = require("../../../Trigger");
var Aurora;
(function (Aurora) {
    Aurora.失心童话 = {
        info: (0, Skill_1.genSkillInfo)("技能:失心童话", "雷电技能", "伤害技能", "单体技能", "奥义技能"),
        cost: 64,
        cast(skillData) {
            const { user, targetList } = skillData;
            (0, Skill_1.checkTargets)(targetList, 1, 1);
            if (!user.hasBuff(Aurora.噩廻))
                user.dataTable["上一次失心童话潜境"] = skillData;
            else
                skillData = user.dataTable["上一次失心童话潜境"];
            user.addBuff(Aurora.噩廻, user.dynmaicStatus.当前怒气, 1);
            user.dynmaicStatus.当前怒气 = 0;
            let atk = (0, Skill_1.genAttack)(skillData, 1, "雷电伤害");
            for (let i = 0; i < 3; i++)
                targetList[0].getHit(atk);
            let count = user.getBuffStackCountAndT(Aurora.噩廻);
            if (count >= 32) {
                let factor = 0.2 + (user.getBuffStackCountAndT(Aurora.电棘丛生效果) * 0.2);
                let addatk = (0, Skill_1.genAttack)(skillData, factor, "雷电伤害");
                targetList[0].getHit(addatk);
            }
        }
    };
    Aurora.噩廻 = {
        info: (0, Modify_1.genBuffInfo)("效果:噩廻", "正面效果"),
        canSatck: true,
        stackMultModify: {
            攻击: 0.002,
        },
        stackAddModify: {
            伤害系数: 0.03,
        },
        damageCons: ["奥义技能", "雷电技能"],
    };
    /**荆雷奔袭技能 */
    Aurora.荆雷奔袭 = {
        info: (0, Skill_1.genSkillInfo)("技能:荆雷奔袭", "雷电技能", "伤害技能", "单体技能", "核心技能"),
        cost: 16,
        cast(skillData) {
            const { user, targetList } = skillData;
            (0, Skill_1.checkTargets)(targetList, 1, 1);
            let atk = (0, Skill_1.genAttack)(skillData, 0.9, "雷电伤害");
            for (let i = 0; i < 2; i++)
                targetList[0].getHit(atk);
            user.addBuff(Aurora.荆雷奔袭效果, 1, 2);
        }
    };
    /**荆雷奔袭攻击力效果 */
    Aurora.荆雷奔袭效果 = {
        info: (0, Modify_1.genBuffInfo)("效果:荆雷奔袭", "正面效果"),
        multModify: {
            技能伤害: 0.25,
        },
        damageCons: ["雷电技能"],
    };
    /**电棘丛生技能 */
    Aurora.电棘丛生 = {
        info: (0, Skill_1.genSkillInfo)("技能:电棘丛生", "雷电技能", "被动技能", "无范围技能", "秘术技能"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:电棘丛生"),
                hook: "造成技能伤害后",
                trigger(damage) {
                    if (damage.source.char == null)
                        return;
                    let char = damage.source.char;
                    const countFlag = "电荆丛生攻击计数";
                    if (char.getBuffStackCountAndT(Aurora.电棘丛生效果) < 3) {
                        if (char.dataTable[countFlag] == null)
                            char.dataTable[countFlag] = 0;
                        char.dataTable[countFlag] += 1;
                    }
                    if (char.dataTable[countFlag] >= 3) {
                        char.dataTable[countFlag] = 0;
                        char.addBuff(Aurora.电棘丛生效果, 1);
                    }
                }
            }]
    };
    /**电棘丛生攻击力效果 */
    Aurora.电棘丛生效果 = {
        info: (0, Modify_1.genBuffInfo)("效果:电棘丛生B", "正面效果"),
        canSatck: true,
        stackLimit: 3,
        stackMultModify: {
            攻击: 0.05,
        }
    };
    /**续存战意被动效果 */
    Aurora.存续战意 = {
        info: (0, Skill_1.genSkillInfo)("技能:存续战意", "非技能", "被动技能", "无范围技能", "特性技能"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:存续战意"),
                hook: "释放技能后",
                trigger(skillData) {
                    const { user } = skillData;
                    user.addBuff(Aurora.存续战意A);
                    if (user.getBuffStackCountAndT(Aurora.存续战意A) >= 5 && !user.buffTable.hasBuff(Aurora.存续战意B))
                        user.addBuff(Aurora.存续战意B);
                }
            }]
    };
    /**续存战意 每层效果 */
    Aurora.存续战意A = {
        info: (0, Modify_1.genBuffInfo)("效果:存续战意A", "正面效果"),
        canSatck: true,
        stackLimit: 5,
        stackMultModify: {
            攻击: 0.015,
        }
    };
    /**续存战意 5层效果 */
    Aurora.存续战意B = {
        info: (0, Modify_1.genBuffInfo)("效果:存续战意B", "正面效果"),
        multModify: {
            攻击: 0.075,
        }
    };
    Aurora.baseStatus = {
        攻击: 10000
    };
    function genChar(name, status) {
        let opt = Object.assign({}, Aurora.baseStatus, status);
        let char = new Character_1.Character(name || "Aurora", opt);
        char.addSkill(Aurora.存续战意);
        char.addSkill(Aurora.电棘丛生);
        return char;
    }
    Aurora.genChar = genChar;
})(Aurora = exports.Aurora || (exports.Aurora = {}));
(0, DataTable_1.regDataTable)(Aurora);
