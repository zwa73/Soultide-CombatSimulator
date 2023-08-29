"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDamageTypeName = exports.固定伤害 = exports.治疗伤害 = exports.流血伤害 = exports.暗蚀伤害 = exports.燃烧伤害 = exports.极寒伤害 = exports.电击伤害 = exports.物理伤害 = exports.魔法伤害 = exports.火焰伤害 = exports.冰霜伤害 = exports.雷电伤害 = void 0;
/**伤害类型枚举 */
const DamageTypeBaseStrList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
exports.雷电伤害 = Symbol("雷电伤害");
exports.冰霜伤害 = Symbol("冰霜伤害");
exports.火焰伤害 = Symbol("火焰伤害");
exports.魔法伤害 = Symbol("魔法伤害");
exports.物理伤害 = Symbol("物理伤害");
exports.电击伤害 = Symbol("电击伤害");
exports.极寒伤害 = Symbol("极寒伤害");
exports.燃烧伤害 = Symbol("燃烧伤害");
exports.暗蚀伤害 = Symbol("暗蚀伤害");
exports.流血伤害 = Symbol("流血伤害");
exports.治疗伤害 = Symbol("治疗伤害");
exports.固定伤害 = Symbol("固定伤害");
const DamageTypeList = [
    exports.雷电伤害,
    exports.冰霜伤害,
    exports.火焰伤害,
    exports.魔法伤害,
    exports.物理伤害,
    exports.电击伤害,
    exports.极寒伤害,
    exports.燃烧伤害,
    exports.暗蚀伤害,
    exports.流血伤害,
    exports.治疗伤害,
    exports.固定伤害,
];
const DamageTypeNameMap = {
    [exports.雷电伤害]: "雷电伤害",
    [exports.冰霜伤害]: "冰霜伤害",
    [exports.火焰伤害]: "火焰伤害",
    [exports.魔法伤害]: "魔法伤害",
    [exports.物理伤害]: "物理伤害",
    [exports.电击伤害]: "电击伤害",
    [exports.极寒伤害]: "极寒伤害",
    [exports.燃烧伤害]: "燃烧伤害",
    [exports.暗蚀伤害]: "暗蚀伤害",
    [exports.流血伤害]: "流血伤害",
    [exports.治疗伤害]: "治疗伤害",
    [exports.固定伤害]: "固定伤害",
};
/**获取伤害类型的名称 */
function getDamageTypeName(type) {
    return DamageTypeNameMap[type];
}
exports.getDamageTypeName = getDamageTypeName;
