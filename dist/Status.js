"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefStaticStatus = void 0;
const Modify_1 = require("./Modify");
/**默认的属性 */
exports.DefStaticStatus = {
    最大生命: 0,
    攻击: 0,
    速度: 0,
    防御: 0,
    暴击率: 0.05,
    暴击伤害: 1.5,
    初始怒气: 0,
    闪避: 0,
    最大怒气: 120,
    怒气回复: 16,
};
Modify_1.ModifyTypeList.forEach(item => exports.DefStaticStatus[item] = 0);
