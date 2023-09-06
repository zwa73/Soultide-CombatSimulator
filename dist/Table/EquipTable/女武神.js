"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.女武神 = void 0;
const DataTable_1 = require("../../DataTable");
const Modify_1 = require("../../Modify");
const GenericEquip_1 = require("./GenericEquip");
const Trigger_1 = require("../../Trigger");
var 女武神;
(function (女武神) {
    女武神.女武神Gen = function (lvl) {
        const 神威 = 女武神.神威Gen(lvl);
        return {
            info: (0, Modify_1.genBuffInfo)("效果:女武神蕴灵", "其他效果"),
            addModify: GenericEquip_1.GenericEquip.攻击蕴灵属性Gen(lvl),
            triggerList: [{
                    info: (0, Trigger_1.genTriggerInfo)("触发:女武神"),
                    hook: "造成攻击后",
                    trigger(attack, victmin) {
                        attack.source.char.addBuff(神威);
                    },
                }]
        };
    };
    女武神.神威Gen = function (lvl) {
        return {
            info: (0, Modify_1.genBuffInfo)("效果:神威", "正面效果"),
            canSatck: true,
            stackLimit: ([6, 8, 10, 12, 15])[(0, GenericEquip_1.fiXlvl)(lvl) - 1],
            stackMultModify: {
                攻击: 0.02
            }
        };
    };
})(女武神 = exports.女武神 || (exports.女武神 = {}));
(0, DataTable_1.regDataTable)(女武神);
