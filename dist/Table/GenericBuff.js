"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericBuff = void 0;
const DataTable_1 = require("../DataTable");
const Modify_1 = require("../Modify");
const __1 = require("..");
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
    GenericBuff.弱点Gen = (lvl = 1, ...dmgCons) => {
        const 弱点 = {
            info: (0, Modify_1.genBuffInfo)("效果:弱点", "其他效果"),
            triggerList: [{
                    info: (0, __1.genTriggerInfo)("触发:弱点"),
                    weight: Infinity,
                    hook: "受到技能伤害后",
                    damageCons: [[...dmgCons]],
                    trigger(damage, target) {
                        if (target.dataTable["弱点层数"] == null)
                            target.dataTable["弱点层数"] = lvl;
                        if (!target.hasBuff(GenericBuff.弱点击破)) {
                            let count = target.dataTable["弱点层数"];
                            target.dataTable["弱点层数"] = --count;
                            if (count <= 0) {
                                target.addBuff(GenericBuff.弱点击破, 1, 2);
                                target.dataTable["弱点层数"] = lvl;
                            }
                        }
                    },
                }]
        };
        return 弱点;
    };
    GenericBuff.全弱点Gen = (lvl = 1) => {
        return GenericBuff.弱点Gen(lvl, "冰霜技能", "火焰技能", "物理技能", "雷电技能", "魔法技能", "无类型技能");
    };
    GenericBuff.弱点击破 = {
        info: (0, Modify_1.genBuffInfo)("效果:弱点击破", "其他效果"),
        triggerList: [{
                info: (0, __1.genTriggerInfo)("触发:弱点击破"),
                weight: Infinity,
                hook: "受到伤害前",
                trigger(damage, target) {
                    damage.magnification *= 2;
                    return damage;
                },
            }]
    };
})(GenericBuff = exports.GenericBuff || (exports.GenericBuff = {}));
(0, DataTable_1.regDataTable)(GenericBuff);
