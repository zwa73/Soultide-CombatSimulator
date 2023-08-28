"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchCons = exports.ModifyTypeList = void 0;
const Damage_1 = require("./Damage");
const Skill_1 = require("./Skill");
exports.ModifyTypeList = [];
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
Damage_1.DamageTypeList.forEach(item => exports.ModifyTypeList.push(`${item}附伤`));
Skill_1.SkillCategoryList.forEach(item => exports.ModifyTypeList.push(`${item}伤害`));
exports.ModifyTypeList.push("技能伤害", "暴击伤害", "攻击", "所有伤害", "伤害系数");
/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
function matchCons(isHurt, info, cons) {
    let infos = [
        info.skillCategory, info.skillRange, info.skillType, info.dmgType
    ];
    if (isHurt)
        infos.push("受攻击时");
    //遍历约束
    for (let con of cons)
        if (!infos.includes(con))
            return false;
    return true;
}
exports.matchCons = matchCons;
