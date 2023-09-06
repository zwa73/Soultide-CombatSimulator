"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.稻草人 = void 0;
const _GenericBuff_1 = require("../../GenericBuff");
const Character_1 = require("../../../Character");
const DataTable_1 = require("../../../DataTable");
var 稻草人;
(function (稻草人_1) {
    稻草人_1.稻草人Status = {
        最大生命: 490000,
        防御: 2500,
    };
    稻草人_1.稻草人Gen = function (name, status) {
        let opt = Object.assign({}, 稻草人_1.稻草人Status, status);
        let 稻草人 = new Character_1.Character(name || "稻草人", opt);
        稻草人._buffTable.addBuff(_GenericBuff_1.GenericBuff.全弱点Gen(8));
        return 稻草人;
    };
})(稻草人 = exports.稻草人 || (exports.稻草人 = {}));
(0, DataTable_1.regDataTable)(稻草人);
