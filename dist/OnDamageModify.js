"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConstraints = exports.ModifyTypeList = void 0;
const Damage_1 = require("./Damage");
const Skill_1 = require("./Skill");
exports.ModifyTypeList = [];
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}附伤`));
Skill_1.SkillCategoryList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
exports.ModifyTypeList.push("技能伤害", "暴击伤害", "攻击", "所有伤害", "伤害系数");
/**判断target是否完全包含base */
function testConstraints(base, target) {
    for (let str of target) {
        if (target.includes(base.skillCategory) ||
            target.includes(base.skillRange) ||
            target.includes(base.skillType) ||
            target.includes(base.dmgType))
            continue;
        return false;
    }
    return true;
}
exports.testConstraints = testConstraints;
