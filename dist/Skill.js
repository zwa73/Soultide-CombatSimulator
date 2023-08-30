"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTargets = exports.genSkillInfo = exports.genAttack = exports.genDamage = exports.genDamageInfo = void 0;
const Attack_1 = require("./Attack");
const Damage_1 = require("./Damage");
//———————————————————— 技能 ————————————————————//
/**技能类型 */
const SkillMaintypeList = ["雷电", "冰霜", "火焰", "魔法", "物理", "非"];
/**技能范围 */
const SkillRangeList = ["单体", "群体", "无范围"];
/**技能子类型 */
const SkillSubtypeList = ["伤害", "治疗", "辅助"];
/**技能类别 */
const SkillCategoryList = ["普攻", "核心", "秘术", "奥义", "其他"];
function genDamageInfo(info, dmgType) {
    return {
        skillName: info.skillName,
        skillCategory: info.skillCategory,
        skillRange: info.skillRange,
        skillType: info.skillType,
        skillSubtype: info.skillSubtype,
        dmgType: dmgType,
    };
}
exports.genDamageInfo = genDamageInfo;
function genDamage(skill, skillData, factor, dmgType, ...specEffects) {
    return new Damage_1.Damage({ char: skillData.user, skill: skillData }, factor, genDamageInfo(skill.info, dmgType), ...specEffects);
}
exports.genDamage = genDamage;
function genAttack(skill, skillData, factor, dmgType, ...specEffects) {
    return new Attack_1.Attack({ char: skillData.user, skill: skillData }, genDamage(skill, skillData, factor, dmgType, ...specEffects));
}
exports.genAttack = genAttack;
function genSkillInfo(skillName, skillType, skillSubtype, skillRange, skillCategory) {
    return { skillName, skillType, skillSubtype, skillRange, skillCategory };
}
exports.genSkillInfo = genSkillInfo;
function checkTargets(targets, needMin, needMax) {
    if (targets.length > needMax || targets.length < needMin)
        throw "checkTargets错误 需求目标数:" + needMin + "~" + needMax + " 实际目标数:" + targets.length;
}
exports.checkTargets = checkTargets;
