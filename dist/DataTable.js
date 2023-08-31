"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regDataTable = exports.GlobalTiggerTable = exports.BuffDataTable = exports.SkillDataTable = void 0;
/**所有的技能表 */
exports.SkillDataTable = {};
/**所有的效果表 */
exports.BuffDataTable = {};
exports.GlobalTiggerTable = {};
/**注册数据 */
function regDataTable(table) {
    const dt = table;
    for (const key in dt) {
        const data = dt[key];
        if ("info" in data) {
            if ("buffName" in data.info)
                exports.BuffDataTable[data.info.buffName] = data;
            if ("skillName" in data.info)
                exports.SkillDataTable[data.info.skillName] = data;
        }
    }
    return table;
}
exports.regDataTable = regDataTable;
