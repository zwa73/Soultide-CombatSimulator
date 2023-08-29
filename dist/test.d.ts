export declare const 雷电伤害: unique symbol;
export declare const 冰霜伤害: unique symbol;
export declare const 火焰伤害: unique symbol;
export declare const 魔法伤害: unique symbol;
export declare const 物理伤害: unique symbol;
export declare const 电击伤害: unique symbol;
export declare const 极寒伤害: unique symbol;
export declare const 燃烧伤害: unique symbol;
export declare const 暗蚀伤害: unique symbol;
export declare const 流血伤害: unique symbol;
export declare const 治疗伤害: unique symbol;
export declare const 固定伤害: unique symbol;
declare const DamageTypeList: readonly [typeof 雷电伤害, typeof 冰霜伤害, typeof 火焰伤害, typeof 魔法伤害, typeof 物理伤害, typeof 电击伤害, typeof 极寒伤害, typeof 燃烧伤害, typeof 暗蚀伤害, typeof 流血伤害, typeof 治疗伤害, typeof 固定伤害];
declare const DamageTypeNameMap: {
    readonly [雷电伤害]: "雷电伤害";
    readonly [冰霜伤害]: "冰霜伤害";
    readonly [火焰伤害]: "火焰伤害";
    readonly [魔法伤害]: "魔法伤害";
    readonly [物理伤害]: "物理伤害";
    readonly [电击伤害]: "电击伤害";
    readonly [极寒伤害]: "极寒伤害";
    readonly [燃烧伤害]: "燃烧伤害";
    readonly [暗蚀伤害]: "暗蚀伤害";
    readonly [流血伤害]: "流血伤害";
    readonly [治疗伤害]: "治疗伤害";
    readonly [固定伤害]: "固定伤害";
};
export type DamageTypeName = typeof DamageTypeNameMap[DamageType];
export type DamageType = typeof DamageTypeList[number];
/**获取伤害类型的名称 */
export declare function getDamageTypeName(type: DamageType): DamageTypeName;
export type tt = Record<DamageTypeName, DamageType>;
export {};