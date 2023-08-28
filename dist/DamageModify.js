"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageCategoryList = exports.DamageSpecMap = exports.暴击 = exports.穿防 = exports.穿盾 = exports.稳定 = exports.固定 = exports.治疗 = exports.SpecEffact = exports.DamageIncludeMap = exports.DamageTypeList = void 0;
/**伤害类型枚举 */
exports.DamageTypeList = ["雷电", "冰霜", "火焰", "魔法", "物理",
    "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
const DamageTypeUndefineRecord = exports.DamageTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
/**伤害包含关系表 */
exports.DamageIncludeMap = DamageTypeUndefineRecord;
exports.DamageIncludeMap.雷电 = ["雷电", "电击"];
exports.DamageIncludeMap.冰霜 = ["冰霜", "极寒"];
exports.DamageIncludeMap.火焰 = ["火焰", "燃烧"];
exports.DamageIncludeMap.魔法 = ["魔法", "暗蚀"];
exports.DamageIncludeMap.物理 = ["物理", "流血"];
/**伤害特效 */
var SpecEffact;
(function (SpecEffact) {
    /**造成治疗 */
    SpecEffact["\u6CBB\u7597"] = "\u6CBB\u7597";
    /**不享受任何加成 造成相当于系数的伤害 */
    SpecEffact["\u56FA\u5B9A"] = "\u56FA\u5B9A";
    /**不会浮动 */
    SpecEffact["\u7A33\u5B9A"] = "\u7A33\u5B9A";
    /**穿透护盾 */
    SpecEffact["\u7A7F\u76FE"] = "\u7A7F\u76FE";
    /**忽视防御 */
    SpecEffact["\u7A7F\u9632"] = "\u7A7F\u9632";
    /**暴击伤害 */
    SpecEffact["\u66B4\u51FB"] = "\u66B4\u51FB";
})(SpecEffact = exports.SpecEffact || (exports.SpecEffact = {}));
;
exports.治疗 = SpecEffact.治疗, exports.固定 = SpecEffact.固定, exports.稳定 = SpecEffact.稳定, exports.穿盾 = SpecEffact.穿盾, exports.穿防 = SpecEffact.穿防, exports.暴击 = SpecEffact.暴击;
/**伤害特殊效果表 */
exports.DamageSpecMap = DamageTypeUndefineRecord;
exports.DamageSpecMap.治疗 = [exports.治疗];
exports.DamageSpecMap.固定 = [exports.固定, exports.稳定, exports.穿防];
exports.DamageSpecMap.燃烧 = [exports.穿盾];
/**伤害类别 */
exports.DamageCategoryList = ["技能造成的", "非技能造成的"];
