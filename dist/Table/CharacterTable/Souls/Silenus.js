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
    Silenus.星尘余烬 = {
        info: (0, Skill_1.genSkillInfo)("技能:星尘余烬", "冰霜技能", "伤害技能", "单体技能", "奥义技能"),
        cost: 64,
        cast(skillData) {
            (0, Skill_1.procSTSkill)(skillData, (data) => {
                const { target } = data;
                target.addBuff(Silenus.极寒诅咒, 1, 2);
                let atk = (0, Attack_1.genAttack)(skillData, 3.6, "冰霜伤害");
                target.getHit(atk);
            });
        },
    };
    Silenus.极寒诅咒 = {
        info: (0, Modify_1.genBuffInfo)("效果:极寒诅咒", "负面效果"),
        triggerList: [{
                info: (0, Trigger_1.genTriggerInfo)("触发:极寒诅咒"),
                hook: "获取效果层数后",
                trigger(char, buff, stackCount) {
                    if (buff === _GenericBuff_1.GenericBuff.极寒)
                        return stackCount * 2;
                    return stackCount;
                },
            }],
        specialModify(table) {
            const char = table.attacherChar;
            let dmg = char.getBuffStackCountAndT(_GenericBuff_1.GenericBuff.极寒) * 0.02;
            return { multModify: {
                    受到所有伤害: dmg
                } };
        },
    };
    Silenus.寂灭昭示 = {
        info: (0, Skill_1.genSkillInfo)("技能:寂灭昭示", "冰霜技能", "伤害技能", "单体技能", "秘术技能"),
        cost: 24,
        cast(skillData) {
            (0, Skill_1.procSTSkill)(skillData, (data) => {
                const { target } = data;
                target.addBuff(Silenus.寂灭昭示效果, 1, 2);
                let atk = (0, Attack_1.genAttack)(skillData, 2.1, "冰霜伤害");
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
            }],
        specialModify(table) {
            const char = table.attacherChar;
            let dmg = 0.1;
            if (char.getBuffStackCountAndT(_GenericBuff_1.GenericBuff.极寒) >= 5)
                dmg += 0.1;
            return { multModify: {
                    受到冰霜伤害: dmg
                } };
        },
    };
})(Silenus = exports.Silenus || (exports.Silenus = {}));
(0, DataTable_1.regDataTable)(Silenus);
