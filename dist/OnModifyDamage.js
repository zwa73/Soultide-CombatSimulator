"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConstraints = void 0;
/**判断target是否完全包含base */
function testConstraints(base, target) {
    for (let key in target) {
        let bval = base[key];
        let tval = target[key];
        if (tval == null)
            continue;
        if (bval == null)
            return false;
        for (let str of bval)
            if (!tval.includes(str))
                return false;
    }
    return true;
}
exports.testConstraints = testConstraints;
