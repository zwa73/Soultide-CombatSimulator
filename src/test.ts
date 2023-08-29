

/**伤害类型枚举 */
const DamageTypeBaseStrList = ["雷电","冰霜","火焰","魔法","物理",
    "电击","极寒","燃烧","暗蚀","流血","治疗","固定"] as const;
export const 雷电伤害 = Symbol("雷电伤害");
export const 冰霜伤害 = Symbol("冰霜伤害");
export const 火焰伤害 = Symbol("火焰伤害");
export const 魔法伤害 = Symbol("魔法伤害");
export const 物理伤害 = Symbol("物理伤害");
export const 电击伤害 = Symbol("电击伤害");
export const 极寒伤害 = Symbol("极寒伤害");
export const 燃烧伤害 = Symbol("燃烧伤害");
export const 暗蚀伤害 = Symbol("暗蚀伤害");
export const 流血伤害 = Symbol("流血伤害");
export const 治疗伤害 = Symbol("治疗伤害");
export const 固定伤害 = Symbol("固定伤害");
const DamageTypeList = [
    雷电伤害,
    冰霜伤害,
    火焰伤害,
    魔法伤害,
    物理伤害,
    电击伤害,
    极寒伤害,
    燃烧伤害,
    暗蚀伤害,
    流血伤害,
    治疗伤害,
    固定伤害,
] as const;
const DamageTypeNameMap = {
    [雷电伤害]:"雷电伤害",
    [冰霜伤害]:"冰霜伤害",
    [火焰伤害]:"火焰伤害",
    [魔法伤害]:"魔法伤害",
    [物理伤害]:"物理伤害",
    [电击伤害]:"电击伤害",
    [极寒伤害]:"极寒伤害",
    [燃烧伤害]:"燃烧伤害",
    [暗蚀伤害]:"暗蚀伤害",
    [流血伤害]:"流血伤害",
    [治疗伤害]:"治疗伤害",
    [固定伤害]:"固定伤害",
} as const;
export type DamageTypeName = typeof DamageTypeNameMap[DamageType];
export type DamageType = typeof DamageTypeList[number];
/**获取伤害类型的名称 */
export function getDamageTypeName(type:DamageType):DamageTypeName{
    return DamageTypeNameMap[type];
}
export type tt = Record<DamageTypeName,DamageType>