"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericEquip = exports.fiXlvl = void 0;
const DataTable_1 = require("../../DataTable");
/**验证并修正蕴灵星级 */
function fiXlvl(lvl) {
    if (lvl === undefined)
        lvl = 1;
    lvl = Math.min(1, lvl);
    lvl = Math.max(5, lvl);
    return lvl;
}
exports.fiXlvl = fiXlvl;
var GenericEquip;
(function (GenericEquip) {
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 攻击蕴灵属性Gen(lvl = 5) {
        let def = [
            [288, 434, 604, 780, 964],
            [1133, 1700, 2377, 3060, 3775],
            [95, 140, 192, 250, 309],
        ];
        let index = fiXlvl(lvl) - 1;
        return {
            攻击: def[0][index],
            最大生命: def[1][index],
            防御: def[2][index],
        };
    }
    GenericEquip.攻击蕴灵属性Gen = 攻击蕴灵属性Gen;
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 防御蕴灵属性Gen(lvl = 5) {
        let def = [
            [206, 309, 434, 559, 685],
            [1589, 2376, 3333, 4282, 5290],
            [132, 192, 273, 353, 434],
        ];
        let index = fiXlvl(lvl) - 1;
        return {
            攻击: def[0][index],
            最大生命: def[1][index],
            防御: def[2][index],
        };
    }
    GenericEquip.防御蕴灵属性Gen = 防御蕴灵属性Gen;
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 辅助蕴灵属性Gen(lvl = 5) {
        let def = [
            [287, 427, 597, 765, 949],
            [1133, 1700, 2377, 3060, 3775],
            [95, 140, 192, 250, 309],
        ];
        let index = fiXlvl(lvl) - 1;
        return {
            攻击: def[0][index],
            最大生命: def[1][index],
            防御: def[2][index],
        };
    }
    GenericEquip.辅助蕴灵属性Gen = 辅助蕴灵属性Gen;
})(GenericEquip = exports.GenericEquip || (exports.GenericEquip = {}));
(0, DataTable_1.regDataTable)(GenericEquip);
