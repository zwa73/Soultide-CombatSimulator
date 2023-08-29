import { Attack, AttackSource } from "./Attack";
import { Writeable } from "@zwa73/utils";
import { Character } from "./Character";
import { SkillInfo } from "./Skill";
/**伤害类型枚举 */
declare const DamageBaseTypeList: readonly ["雷电", "冰霜", "火焰", "魔法", "物理", "电击", "极寒", "燃烧", "暗蚀", "流血", "治疗", "固定"];
/**伤害类型 */
export type DamageType = `${typeof DamageBaseTypeList[number]}伤害`;
/**附伤类型 additional damage */
export type AddiDamageType = `${typeof DamageBaseTypeList[number]}附伤`;
/**伤害特效 */
export declare enum SpecEffect {
    /**造成治疗 */
    治疗 = "\u6CBB\u7597",
    /**不享受任何加成 造成相当于系数的伤害 */
    固定 = "\u56FA\u5B9A",
    /**不会浮动 */
    稳定 = "\u7A33\u5B9A",
    /**穿透护盾 */
    穿盾 = "\u7A7F\u76FE",
    /**忽视防御 */
    穿防 = "\u7A7F\u9632",
    /**暴击伤害 */
    暴击 = "\u66B4\u51FB"
}
export declare const 治疗: SpecEffect, 固定: SpecEffect, 稳定: SpecEffect, 穿盾: SpecEffect, 穿防: SpecEffect, 暴击: SpecEffect;
/**伤害类型详情 */
export type DamageInfo = {
    /**伤害类型 */
    dmgType: DamageType;
} & Writeable<SkillInfo>;
/**伤害来源 */
export type DamageSource = {
    /**攻击来源 */
    attack?: Attack;
} & AttackSource;
/**伤害 */
export declare class Damage {
    /**伤害详细类型 */
    info: DamageInfo;
    /**系数 */
    factor: number;
    /**特效 */
    specEffects: SpecEffect[];
    /**来源 */
    source: DamageSource;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param specEffects 特殊效果
     */
    constructor(source: DamageSource, factor: number, info: DamageInfo, ...specEffects: SpecEffect[]);
    /**计算攻击时应用的加值与倍率
     * @param target  受伤角色
     * @returns [ multModMap, addModMap ]
     */
    private calcOnDamageModify;
    /**对数值进行增益
     * @param base       基础值
     * @param flag       增益名
     * @param multModMap 倍率Map
     * @param addModMap  加值Map
     */
    private modValue;
    /**含有某个特效 */
    hasSpecEffect(flag: SpecEffect): boolean | undefined;
    /**计算伤害 */
    calcOverdamage(target: Character): number;
    /**是技能伤害 */
    isSkillDamage(): boolean;
    /**复制一份伤害 */
    clone(): Damage;
}
export {};
