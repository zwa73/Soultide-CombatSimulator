import { Character } from "./Character";
import { Damage } from "./Damage";
import { SkillData } from "./Skill";
export type TriggerBase = {
    readonly info: TriggerInfo;
    /**触发点 */
    readonly hook: AnyHook;
    /**权重 默认0*/
    readonly weight?: number;
    /**触发函数 */
    readonly trigger: (...args: any) => any;
};
/**释放技能前 */
export interface TUseSkillBefore extends TriggerBase {
    readonly hook: "释放技能前";
    /**触发 使用技能前 触发器
     * @param skillData 技能参数
     */
    readonly trigger: (skillData: SkillData) => SkillData;
}
/**释放技能后 */
export interface TUseSkillAfter extends TriggerBase {
    readonly hook: "释放技能后";
    /**触发 使用技能后 触发器
     * @param skillData 技能参数
     */
    readonly trigger: (skillData: SkillData) => SkillData;
}
/**造成伤害前 */
export interface TDealDamageBefore extends TriggerBase {
    readonly hook: "造成伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger: (damage: Damage, target: Character) => Damage;
}
/**造成伤害后 */
export interface TDealDamageAfter extends TriggerBase {
    readonly hook: "造成伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger: (damage: Damage, target: Character) => Damage;
}
/**造成技能伤害前 */
export interface TDealSkillDamageBefore extends TriggerBase {
    readonly hook: "造成技能伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger: (damage: Damage, target: Character) => Damage;
}
/**造成技能伤害后 */
export interface TDealSkillDamageAfter extends TriggerBase {
    readonly hook: "造成技能伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger: (damage: Damage, target: Character) => Damage;
}
export type TriggerName = `触发:${string}`;
export type TriggerInfo = {
    readonly triggerName: TriggerName;
};
/**生成触发器info */
export declare function genTriggerInfo(triggerName: TriggerName): TriggerInfo;
/**触发器表 */
export type HookTriggerMap = {
    readonly 释放技能后: TUseSkillBefore;
    readonly 释放技能前: TUseSkillAfter;
    readonly 造成伤害后: TDealDamageBefore;
    readonly 造成伤害前: TDealDamageAfter;
    readonly 造成技能伤害后: TDealSkillDamageBefore;
    readonly 造成技能伤害前: TDealSkillDamageAfter;
};
export type AnyHook = keyof HookTriggerMap;
export type AnyTrigger = HookTriggerMap[keyof HookTriggerMap];
