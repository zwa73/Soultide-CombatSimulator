"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.稻草人 = void 0;
const Character_1 = require("../../../Character");
var 稻草人;
(function (稻草人) {
    稻草人.baseStatus = {
        最大生命: 490000,
        防御: 2500,
    };
    function genChar(status) {
        let opt = Object.assign({}, 稻草人.baseStatus, status);
        return new Character_1.Character("稻草人", opt);
    }
    稻草人.genChar = genChar;
})(稻草人 = exports.稻草人 || (exports.稻草人 = {}));
