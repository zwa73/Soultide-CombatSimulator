"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSort = exports.genTriggerInfo = void 0;
/**生成触发器info */
function genTriggerInfo(triggerName) {
    return {
        triggerName,
    };
}
exports.genTriggerInfo = genTriggerInfo;
function TriggerSort(a, b) {
    let aw = 0;
    let bw = 0;
    if ("char" in a)
        aw = a.t.weight || 0;
    else
        aw = a.weight || 0;
    if ("char" in b)
        bw = b.t.weight || 0;
    else
        bw = b.weight || 0;
    return bw - aw;
}
exports.TriggerSort = TriggerSort;
