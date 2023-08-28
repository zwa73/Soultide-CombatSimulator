"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConstraints = void 0;
/**判断target是否完全包含base */
function testConstraints(base, target) {
    for (let str of target) {
        if (target.includes(base.skillCategory) ||
            target.includes(base.skillRange) ||
            target.includes(base.skillType) ||
            target.includes(base.dmgType))
            continue;
        return false;
    }
    return true;
}
exports.testConstraints = testConstraints;
