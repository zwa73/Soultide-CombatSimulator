"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSkillInfo = exports.procMTSkill = exports.procSTSkill = void 0;
//———————————————————— 技能 ————————————————————//
/**技能类型 */
const SkillMaintypeList = ["雷电", "冰霜", "火焰", "魔法", "物理", "无类型"];
/**技能范围 */
const SkillRangeList = ["单体", "群体", "无范围"];
/**技能子类型 */
const SkillSubtypeList = ["伤害", "治疗", "辅助", "被动"];
/**技能类别 */
const SkillCategoryList = ["普攻", "核心", "秘术", "奥义", "特性", "无类别"];
/**处理单体技能 process single skill*/
function procSTSkill(skillData, func) {
    checkTargets(skillData.targetList, 1, 1);
    const { targetList, ...rest } = skillData;
    const single = {
        ...rest,
        target: skillData.targetList[0]
    };
    return func(single);
}
exports.procSTSkill = procSTSkill;
/**处理N个目标的技能 */
function procMTSkill(skillData, targetCount, func) {
    checkTargets(skillData.targetList, targetCount, targetCount);
    const { targetList, ...rest } = skillData;
    const fixedList = targetList;
    const data = {
        ...rest,
        targetList: fixedList
    };
    return func(data);
}
exports.procMTSkill = procMTSkill;
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
