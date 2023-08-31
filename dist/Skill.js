"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTargets = exports.genSkillInfo = exports.genAttack = exports.genSkillDamage = exports.genNonSkillDamage = exports.genDamageInfo = void 0;
const Attack_1 = require("./Attack");
const Damage_1 = require("./Damage");
//———————————————————— 技能 ————————————————————//
/**技能类型 */
const SkillMaintypeList = ["雷电", "冰霜", "火焰", "魔法", "物理", "非"];
/**技能范围 */
const SkillRangeList = ["单体", "群体", "无范围"];
/**技能子类型 */
const SkillSubtypeList = ["伤害", "治疗", "辅助", "被动"];
/**技能类别 */
const SkillCategoryList = ["普攻", "核心", "秘术", "奥义", "特性"];
/**生成伤害信息 */
function genDamageInfo(dmgType, info) {
    return {
        skillName: info ? info.skillName : undefined,
        skillCategory: info ? info.skillCategory : undefined,
        skillRange: info ? info.skillRange : undefined,
        skillType: info ? info.skillType : "非技能",
        skillSubtype: info ? info.skillSubtype : undefined,
        dmgType: dmgType,
    };
}
exports.genDamageInfo = genDamageInfo;
/**产生非技能伤害 */
function genNonSkillDamage(factor, dmgType, char, ...specEffects) {
    return new Damage_1.Damage({ char: char }, factor, genDamageInfo(dmgType), ...specEffects);
}
exports.genNonSkillDamage = genNonSkillDamage;
/**产生技能伤害 */
function genSkillDamage(factor, dmgType, skillData, ...specEffects) {
    return new Damage_1.Damage({
        char: skillData?.user,
        skillData: skillData
    }, factor, genDamageInfo(dmgType, skillData?.skill.info), ...specEffects);
}
exports.genSkillDamage = genSkillDamage;
/**产生攻击 */
function genAttack(skillData, factor, dmgType, ...specEffects) {
    return new Attack_1.Attack({ char: skillData.user, skillData: skillData }, genSkillDamage(factor, dmgType, skillData, ...specEffects));
}
exports.genAttack = genAttack;
/**生成技能信息 */
function genSkillInfo(skillName, skillType, skillSubtype, skillRange, skillCategory) {
    return { skillName, skillType, skillSubtype, skillRange, skillCategory };
}
exports.genSkillInfo = genSkillInfo;
/**检查目标数 如不符合则抛异
 * @param targets 目标
 * @param needMin 最小数量需求 undefine时不限
 * @param needMax 最大数量需求 undefine时不限
 */
function checkTargets(targets, needMin, needMax) {
    needMax = needMax || Infinity;
    needMin = needMin || 0;
    if (targets.length > needMax || targets.length < needMin)
        throw "checkTargets错误 需求目标数: " + needMin + "~" + needMax + " 实际目标数:" + targets.length;
}
exports.checkTargets = checkTargets;
