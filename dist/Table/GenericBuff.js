"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericBuff = void 0;
const DataTable_1 = require("../DataTable");
const Modify_1 = require("../Modify");
var GenericBuff;
(function (GenericBuff) {
    GenericBuff.暗蚀 = {
        info: (0, Modify_1.genBuffInfo)("效果:暗蚀", "负面效果"),
        canSatck: true,
        stackLimit: 10,
        stackMultModify: {
            受到所有伤害: 0.04,
        },
        damageCons: [],
    };
    GenericBuff.极寒 = {
        info: (0, Modify_1.genBuffInfo)("效果:极寒", "负面效果"),
        canSatck: true,
        stackLimit: 10,
        stackMultModify: {
            所有伤害: -0.03,
        },
        damageCons: [],
    };
})(GenericBuff = exports.GenericBuff || (exports.GenericBuff = {}));
(0, DataTable_1.regDataTable)(GenericBuff);
