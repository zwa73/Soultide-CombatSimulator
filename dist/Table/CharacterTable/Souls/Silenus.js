"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silenus = void 0;
const _GenericBuff_1 = require("../../GenericBuff");
const Attack_1 = require("../../../Attack");
const DataTable_1 = require("../../../DataTable");
const Modify_1 = require("../../../Modify");
const Skill_1 = require("../../../Skill");
const Trigger_1 = require("../../../Trigger");
var Silenus;
(function (Silenus) {
    Silenus.寂灭昭示 = {
        info: (0, Skill_1.genSkillInfo)("技能:Silenus", "冰霜技能", "伤害技能", "单体技能", "奥义技能"),
        cost: 64,
        cast(skillData) {
            (0, Skill_1.procSTSkill)(skillData, (data) => {
                const { target } = data;
                target.addBuff(Silenus.寂灭昭示效果, 1, 2);
                let atk = (0, Attack_1.genAttack)(skillData, 3.6, "冰霜伤害");
                target.getHit(atk);
            });
        },
    };
    Silenus.寂灭昭示效果 = {
        info: (0, Modify_1.genBuffInfo)("效果:寂灭昭示", "负面效果"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:寂灭昭示"),
                hook: "获取效果层数后",
                trigger(char, buff, stackCount) {
                    if (buff === _GenericBuff_1.GenericBuff.极寒)
                        return stackCount * 2;
                    return stackCount;
                },
            }]
    };
})(Silenus = exports.Silenus || (exports.Silenus = {}));
(0, DataTable_1.regDataTable)(Silenus);
