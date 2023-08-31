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
            user.addBuff(Aurora.噩廻, user.dynmaicStatus.当前怒气, 1);
            user.dynmaicStatus.当前怒气 = 0;
            let atk = (0, Skill_1.genAttack)(skillData, 1, "雷电伤害");
            for (let i = 0; i < 3; i++)
                targetList[0].getHit(atk);
            let count = user.buffTable.getBuffStack(Aurora.噩廻);
            if (count >= 32) {
                let factor = 0.2 + (user.buffTable.getBuffStack(Aurora.电棘丛生B) * 0.2);
                let addatk = (0, Skill_1.genAttack)(skillData, factor, "雷电伤害");
                targetList[0].getHit(addatk);
            }
        }
    };
    Aurora.噩廻 = {
        info: (0, Modify_1.genBuffInfo)("效果:噩廻"),
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
            user.addBuff(Aurora.荆雷奔袭A, 1, 2);
        }
    };
    /**荆雷奔袭攻击力效果 */
    Aurora.荆雷奔袭A = {
        info: (0, Modify_1.genBuffInfo)("效果:荆雷奔袭A"),
        multModify: {
            技能伤害: 0.25,
        },
        damageCons: ["雷电技能"],
    };
    /**电棘丛生被动效果 */
    Aurora.电棘丛生 = {
        info: (0, Modify_1.genBuffInfo)("效果:电棘丛生"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:电棘丛生"),
                hook: "造成技能伤害后",
                trigger(damage) {
                    if (damage.source.char == null)
                        return damage;
                    let char = damage.source.char;
                    if (char.getBuffStack(Aurora.电棘丛生B) < 3)
                        char.addBuff(Aurora.电棘丛生A);
                    if (char.getBuffStack(Aurora.电棘丛生A) >= 3) {
                        char.addBuff(Aurora.电棘丛生A, -3);
                        char.addBuff(Aurora.电棘丛生B, 1);
                    }
                    return damage;
                }
            }]
    };
    /**电棘丛生攻击计数器 */
    Aurora.电棘丛生A = {
        info: (0, Modify_1.genBuffInfo)("效果:电棘丛生A"),
        canSatck: true,
    };
    /**电棘丛生攻击力效果 */
    Aurora.电棘丛生B = {
        info: (0, Modify_1.genBuffInfo)("效果:电棘丛生B"),
        canSatck: true,
        stackLimit: 3,
        stackMultModify: {
            攻击: 0.05,
        }
    };
    /**续存战意被动效果 */
    Aurora.续存战意 = {
        info: (0, Modify_1.genBuffInfo)("效果:续存战意"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:续存战意"),
                hook: "释放技能后",
                trigger(skillData) {
                    const { user } = skillData;
                    user.addBuff(Aurora.续存战意A);
                    if (user.buffTable.getBuffStack(Aurora.续存战意A) >= 5 && !user.buffTable.hasBuff(Aurora.续存战意B))
                        user.addBuff(Aurora.续存战意B);
                    return skillData;
                }
            }]
    };
    /**续存战意 每层效果 */
    Aurora.续存战意A = {
        info: (0, Modify_1.genBuffInfo)("效果:续存战意A"),
        canSatck: true,
        stackLimit: 5,
        stackMultModify: {
            攻击: 0.015,
        }
    };
    /**续存战意 5层效果 */
    Aurora.续存战意B = {
        info: (0, Modify_1.genBuffInfo)("效果:续存战意B"),
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
        char.addBuff(Aurora.续存战意);
        char.addBuff(Aurora.电棘丛生);
        return char;
    }
    Aurora.genChar = genChar;
})(Aurora = exports.Aurora || (exports.Aurora = {}));
(0, DataTable_1.regDataTable)(Aurora);
