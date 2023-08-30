"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.受到燃烧伤害 = exports.受到极寒伤害 = exports.受到电击伤害 = exports.受到物理伤害 = exports.受到魔法伤害 = exports.受到火焰伤害 = exports.受到冰霜伤害 = exports.受到雷电伤害 = exports.伤害系数 = exports.所有伤害 = exports.暴击伤害 = exports.暴击率 = exports.攻击 = exports.技能伤害 = exports.其他伤害 = exports.奥义伤害 = exports.秘术伤害 = exports.核心伤害 = exports.普攻伤害 = exports.固定附伤 = exports.治疗附伤 = exports.流血附伤 = exports.暗蚀附伤 = exports.燃烧附伤 = exports.极寒附伤 = exports.电击附伤 = exports.物理附伤 = exports.魔法附伤 = exports.火焰附伤 = exports.冰霜附伤 = exports.雷电附伤 = exports.固定伤害 = exports.治疗伤害 = exports.流血伤害 = exports.暗蚀伤害 = exports.燃烧伤害 = exports.极寒伤害 = exports.电击伤害 = exports.物理伤害 = exports.魔法伤害 = exports.火焰伤害 = exports.冰霜伤害 = exports.雷电伤害 = exports.怒气回复 = exports.最大怒气 = exports.闪避 = exports.初始怒气 = exports.防御 = exports.速度 = exports.最大生命 = void 0;
exports.受到伤害系数 = exports.受到所有伤害 = exports.受到暴击伤害 = exports.受到暴击率 = exports.受到攻击 = exports.受到技能伤害 = exports.受到其他伤害 = exports.受到奥义伤害 = exports.受到秘术伤害 = exports.受到核心伤害 = exports.受到普攻伤害 = exports.受到固定附伤 = exports.受到治疗附伤 = exports.受到流血附伤 = exports.受到暗蚀附伤 = exports.受到燃烧附伤 = exports.受到极寒附伤 = exports.受到电击附伤 = exports.受到物理附伤 = exports.受到魔法附伤 = exports.受到火焰附伤 = exports.受到冰霜附伤 = exports.受到雷电附伤 = exports.受到固定伤害 = exports.受到治疗伤害 = exports.受到流血伤害 = exports.受到暗蚀伤害 = void 0;
exports.最大生命 = Symbol("最大生命"); //基础加值
exports.速度 = Symbol("速度");
exports.防御 = Symbol("防御");
exports.初始怒气 = Symbol("初始怒气");
exports.闪避 = Symbol("闪避");
exports.最大怒气 = Symbol("最大怒气");
exports.怒气回复 = Symbol("怒气回复");
exports.雷电伤害 = Symbol("雷电伤害"); //攻击加值 //基础伤害类型
exports.冰霜伤害 = Symbol("冰霜伤害");
exports.火焰伤害 = Symbol("火焰伤害");
exports.魔法伤害 = Symbol("魔法伤害");
exports.物理伤害 = Symbol("物理伤害");
exports.电击伤害 = Symbol("电击伤害");
exports.极寒伤害 = Symbol("极寒伤害");
exports.燃烧伤害 = Symbol("燃烧伤害");
exports.暗蚀伤害 = Symbol("暗蚀伤害");
exports.流血伤害 = Symbol("流血伤害");
exports.治疗伤害 = Symbol("治疗伤害");
exports.固定伤害 = Symbol("固定伤害");
exports.雷电附伤 = Symbol("雷电附伤"); //附伤
exports.冰霜附伤 = Symbol("冰霜附伤");
exports.火焰附伤 = Symbol("火焰附伤");
exports.魔法附伤 = Symbol("魔法附伤");
exports.物理附伤 = Symbol("物理附伤");
exports.电击附伤 = Symbol("电击附伤");
exports.极寒附伤 = Symbol("极寒附伤");
exports.燃烧附伤 = Symbol("燃烧附伤");
exports.暗蚀附伤 = Symbol("暗蚀附伤");
exports.流血附伤 = Symbol("流血附伤");
exports.治疗附伤 = Symbol("治疗附伤");
exports.固定附伤 = Symbol("固定附伤");
exports.普攻伤害 = Symbol("普攻伤害"); //技能伤害类型
exports.核心伤害 = Symbol("核心伤害");
exports.秘术伤害 = Symbol("秘术伤害");
exports.奥义伤害 = Symbol("奥义伤害");
exports.其他伤害 = Symbol("其他伤害");
exports.技能伤害 = Symbol("技能伤害"); //其他攻击加值
exports.攻击 = Symbol("攻击");
exports.暴击率 = Symbol("暴击率");
exports.暴击伤害 = Symbol("暴击伤害");
exports.所有伤害 = Symbol("所有伤害");
exports.伤害系数 = Symbol("伤害系数");
exports.受到雷电伤害 = Symbol("受到雷电伤害"); //受击加值 //基础伤害类型
exports.受到冰霜伤害 = Symbol("受到冰霜伤害");
exports.受到火焰伤害 = Symbol("受到火焰伤害");
exports.受到魔法伤害 = Symbol("受到魔法伤害");
exports.受到物理伤害 = Symbol("受到物理伤害");
exports.受到电击伤害 = Symbol("受到电击伤害");
exports.受到极寒伤害 = Symbol("受到极寒伤害");
exports.受到燃烧伤害 = Symbol("受到燃烧伤害");
exports.受到暗蚀伤害 = Symbol("受到暗蚀伤害");
exports.受到流血伤害 = Symbol("受到流血伤害");
exports.受到治疗伤害 = Symbol("受到治疗伤害");
exports.受到固定伤害 = Symbol("受到固定伤害");
exports.受到雷电附伤 = Symbol("受到雷电附伤"); //附伤
exports.受到冰霜附伤 = Symbol("受到冰霜附伤");
exports.受到火焰附伤 = Symbol("受到火焰附伤");
exports.受到魔法附伤 = Symbol("受到魔法附伤");
exports.受到物理附伤 = Symbol("受到物理附伤");
exports.受到电击附伤 = Symbol("受到电击附伤");
exports.受到极寒附伤 = Symbol("受到极寒附伤");
exports.受到燃烧附伤 = Symbol("受到燃烧附伤");
exports.受到暗蚀附伤 = Symbol("受到暗蚀附伤");
exports.受到流血附伤 = Symbol("受到流血附伤");
exports.受到治疗附伤 = Symbol("受到治疗附伤");
exports.受到固定附伤 = Symbol("受到固定附伤");
exports.受到普攻伤害 = Symbol("受到普攻伤害"); //技能伤害类型
exports.受到核心伤害 = Symbol("受到核心伤害");
exports.受到秘术伤害 = Symbol("受到秘术伤害");
exports.受到奥义伤害 = Symbol("受到奥义伤害");
exports.受到其他伤害 = Symbol("受到其他伤害");
exports.受到技能伤害 = Symbol("受到技能伤害"); //其他攻击加值
exports.受到攻击 = Symbol("受到攻击");
exports.受到暴击率 = Symbol("受到暴击率");
exports.受到暴击伤害 = Symbol("受到暴击伤害");
exports.受到所有伤害 = Symbol("受到所有伤害");
exports.受到伤害系数 = Symbol("受到伤害系数");
const BaseModifyTypeList = [
    exports.最大生命,
    exports.速度,
    exports.防御,
    exports.初始怒气,
    exports.闪避,
    exports.最大怒气,
    exports.怒气回复,
];
const DamageTypeList = [
    exports.雷电伤害,
    exports.冰霜伤害,
    exports.火焰伤害,
    exports.魔法伤害,
    exports.物理伤害,
    exports.电击伤害,
    exports.极寒伤害,
    exports.燃烧伤害,
    exports.暗蚀伤害,
    exports.流血伤害,
    exports.治疗伤害,
    exports.固定伤害,
];
