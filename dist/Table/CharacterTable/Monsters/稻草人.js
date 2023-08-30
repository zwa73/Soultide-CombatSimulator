"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.稻草人 = void 0;
const Character_1 = require("../../../Character");
const DataTable_1 = require("../../../DataTable");
exports.稻草人 = {
    baseStatus: {
        最大生命: 490000,
        防御: 2500,
    },
    genChar(name, status) {
        let opt = Object.assign({}, exports.稻草人.baseStatus, status);
        return new Character_1.Character("稻草人", opt);
    }
};
(0, DataTable_1.regDataTable)(exports.稻草人);
