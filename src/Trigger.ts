import { Attack } from "./Attack";
import { Character } from "./Character";
import { Damage, DamageType } from "./Damage";
import { Buff, DamageConsAnd } from "./Modify";
import { SkillData, SkillType } from "./Skill";


export type TriggerBase={
    readonly info:TriggerInfo;
    /**触发点 */
    readonly hook:AnyHook;
    /**权重 默认0*/
    readonly weight?:number;
    /**触发函数 */
    readonly trigger: (...args:any)=>any;
}

/**释放技能前 */
export interface TUseSkillBefore extends TriggerBase{
    readonly hook:"释放技能前";
    /**触发 使用技能前 触发器
     * @param skillData 技能参数
     * @returns 修改的 技能参数
     */
    readonly trigger:(skillData:SkillData)=>SkillData;
}
/**释放技能后 */
export interface TUseSkillAfter extends TriggerBase{
    readonly hook:"释放技能后";
    /**触发 使用技能后 触发器
     * @param skillData 技能参数
     */
    readonly trigger:(skillData:SkillData)=>void;
}
/**造成伤害前 */
export interface TCauseDamageBefore extends TriggerBase{
    readonly hook:"造成伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     * @returns 修改的 伤害
     */
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成伤害后 */
export interface TCauseDamageAfter extends TriggerBase{
    readonly hook:"造成伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**造成技能伤害前 */
export interface TCauseSkillDamageBefore extends TriggerBase{
    readonly hook:"造成技能伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     * @returns 修改的 伤害
     */
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成技能伤害后 */
export interface TCauseSkillDamageAfter extends TriggerBase{
    readonly hook:"造成技能伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger:(damage:Damage,target:Character)=>void;
}

/**造成某类型伤害前 */
export interface TCauseTypeDamageBefore extends TriggerBase{
    readonly hook:`造成类型伤害前`;
    /**伤害类型约束 */
    readonly damageCons: DamageConsAnd;
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     * @returns 修改的 伤害
     */
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成某类型伤害后 */
export interface TCauseTypeDamageAfter extends TriggerBase{
    readonly hook:`造成类型伤害后`;
    /**伤害类型约束 */
    readonly damageCons: DamageConsAnd;
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**获取效果层数后 */
export interface TGetBuffStackCountAfter extends TriggerBase{
    readonly hook:"获取效果层数后";
    /**触发 使用技能前 触发器
     * @param char       角色
     * @param buff       获取的效果
     * @param stackCount 获取的效果层数
     * @returns 修改的 获取的效果层数
     */
    readonly trigger:(char:Character,buff:Buff,stackCount:number)=>number;
}
/**受攻击前 */
export interface TTakeAttackBefore extends TriggerBase{
    readonly hook:"受攻击前";
    /**触发 使用技能前 触发器
     * @param attack  攻击
     * @param victmin 受害者
     * @returns 修改的 攻击
     */
    readonly trigger:(attack:Attack,victmin:Character)=>Attack;
}
/**受攻击后 */
export interface TTakeAttackAfter extends TriggerBase{
    readonly hook:"受攻击后";
    /**触发 使用技能前 触发器
     * @param attack  攻击
     * @param victmin 受害者
     */
    readonly trigger:(attack:Attack,victmin:Character)=>void;
}
/**攻击前 */
export interface TCauseAttackBefore extends TriggerBase{
    readonly hook:"攻击前";
    /**触发 使用技能前 触发器
     * @param attack  攻击
     * @param victmin 受害者
     * @returns 修改的 攻击
     */
    readonly trigger:(attack:Attack, victmin:Character)=>Attack;
}
/**攻击后 */
export interface TCauseAttackAfter extends TriggerBase{
    readonly hook:"攻击后";
    /**触发 使用技能前 触发器
     * @param attack  攻击
     * @param victmin 受害者
     */
    readonly trigger:(attack:Attack, victmin:Character)=>void;
}

export type TriggerName = `触发:${string}`;
export type TriggerInfo = {
    readonly triggerName:TriggerName
}
/**生成触发器info */
export function genTriggerInfo(triggerName:TriggerName):TriggerInfo{
    return {
        triggerName,
    }
}





/**触发器表 */
export type HookTriggerMap = {
    readonly 释放技能前       : TUseSkillBefore           ;
    readonly 释放技能后       : TUseSkillAfter            ;
    readonly 造成伤害前       : TCauseDamageBefore        ;
    readonly 造成伤害后       : TCauseDamageAfter         ;
    readonly 造成技能伤害前   : TCauseSkillDamageBefore   ;
    readonly 造成技能伤害后   : TCauseSkillDamageAfter    ;
    readonly 获取效果层数后   : TGetBuffStackCountAfter   ;
    readonly 受攻击前         : TTakeAttackBefore         ;
    readonly 受攻击后         : TTakeAttackAfter          ;
    readonly 攻击前           : TCauseAttackBefore        ;
    readonly 攻击后           : TCauseAttackAfter         ;
    readonly 造成类型伤害前   : TCauseTypeDamageBefore    ;
    readonly 造成类型伤害后   : TCauseTypeDamageAfter     ;
};
export type AnyHook   = keyof HookTriggerMap;
export type AnyTrigger = HookTriggerMap[AnyHook];

