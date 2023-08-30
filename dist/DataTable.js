"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regDataTable = exports.GlobalTiggerTable = exports.BuffTable = exports.SkillTable = void 0;
/**技能表 */
exports.SkillTable = {};
exports.BuffTable = {};
exports.GlobalTiggerTable = {};
/**注册数据 */
function regDataTable(table) {
    const dt = table;
    for (const key in dt) {
        const data = dt[key];
        if ("info" in data) {
            if ("buffName" in data.info)
                exports.BuffTable[data.info.buffName] = data;
            if ("skillName" in data.info)
                exports.SkillTable[data.info.skillName] = data;
        }
    }
    return table;
}
exports.regDataTable = regDataTable;
