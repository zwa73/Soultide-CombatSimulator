"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSkillInfo = exports.genAttack = exports.genDamage = exports.genDamageInfo = exports.SkillCategoryList = exports.SkillRangeList = exports.SkillMaintypeList = void 0;
const Attack_1 = require("./Attack");
const Damage_1 = require("./Damage");
/**技能类型 */
exports.SkillMaintypeList = ["雷电", "冰霜", "火焰", "魔法", "物理", "非"];
/**技能范围 */
exports.SkillRangeList = ["单体", "群体", "无范围"];
/**技能类别 */
exports.SkillCategoryList = ["普攻", "核心", "秘术", "奥义", "无类别"];
function genDamageInfo(info, dmgType) {
    return {
        skillCategory: info.category,
        skillRange: info.range,
        skillType: info.type,
        dmgType: dmgType,
    };
}
exports.genDamageInfo = genDamageInfo;
function genDamage(info, skillData, factor, dmgType, ...specEffects) {
    return new Damage_1.Damage(skillData.user, factor, genDamageInfo(info, dmgType), ...specEffects);
}
exports.genDamage = genDamage;
function genAttack(info, skillData, factor, dmgType, ...specEffects) {
    return new Attack_1.Attack(skillData.user, genDamage(info, skillData, factor, dmgType, ...specEffects));
}
exports.genAttack = genAttack;
function genSkillInfo(type, range, category) {
    return { type, range, category };
}
exports.genSkillInfo = genSkillInfo;
