"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericBuff = void 0;
const DataTable_1 = require("../DataTable");
const Modify_1 = require("../Modify");
exports.GenericBuff = {
    暗蚀: {
        info: (0, Modify_1.genBuffInfo)("效果:暗蚀"),
        canSatck: true,
        stackLimit: 10,
        stackMultModify: {
            受到所有伤害: 0.04,
        },
        damageCons: [],
    },
};
(0, DataTable_1.regDataTable)(exports.GenericBuff);
