"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Andrea = void 0;
const DataTable_1 = require("../../../DataTable");
const Skill_1 = require("../../../Skill");
var Andrea;
(function (Andrea) {
    Andrea.极寒狙击 = {
        info: (0, Skill_1.genSkillInfo)("技能:极寒狙击", "冰霜技能", "伤害技能", "单体技能", "奥义技能"),
        cast(skillData) {
        }
    };
    Andrea.寒霜 = {};
})(Andrea = exports.Andrea || (exports.Andrea = {}));
(0, DataTable_1.regDataTable)(Andrea);
