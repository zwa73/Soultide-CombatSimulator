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





//———————————————————— 伤害触发器 ————————————————————//

/**伤害前触发器 */
export interface TDamageBefore extends TriggerBase{
    readonly hook:`${"造成"|"受到"}${string}${"伤害"|"治疗"|"护盾"}前` & AnyHook;
    /**伤害类型约束 */
    readonly damageCons?: DamageConsAnd;
    /**触发 伤害前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     * @returns 修改的 伤害
     */
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成伤害前 */
export interface TCauseDamageBefore extends TDamageBefore{
    readonly hook:"造成伤害前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**受到伤害前 */
export interface TTakeDamageBefore extends TDamageBefore{
    readonly hook:"受到伤害前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成技能伤害前 */
export interface TCauseSkillDamageBefore extends TDamageBefore{
    readonly hook:"造成技能伤害前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**受到技能伤害前 */
export interface TTakeSkillDamageBefore extends TDamageBefore{
    readonly hook:"受到技能伤害前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成治疗前 */
export interface TCauseHealBefore extends TDamageBefore{
    readonly hook:"造成治疗前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}
/**造成护盾前 */
export interface TCauseShieldBefore extends TDamageBefore{
    readonly hook:"造成护盾前";
    readonly trigger:(damage:Damage,target:Character)=>Damage;
}



/**伤害后触发器 */
export interface TDamageAfter extends TriggerBase{
    readonly hook:`${"造成"|"受到"}${string}${"伤害"|"治疗"|"护盾"}后` & AnyHook;
    /**伤害类型约束 */
    readonly damageCons?: DamageConsAnd;
    /**触发 伤害后 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**造成伤害后 */
export interface TCauseDamageAfter extends TDamageAfter{
    readonly hook:"造成伤害后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**受到伤害后 */
export interface TTakeDamageAfter extends TDamageAfter{
    readonly hook:"受到伤害后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**造成技能伤害后 */
export interface TCauseSkillDamageAfter extends TDamageAfter{
    readonly hook:"造成技能伤害后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**受到技能伤害后 */
export interface TTakeSkillDamageAfter extends TDamageAfter{
    readonly hook:"受到技能伤害后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**造成治疗后 */
export interface TCauseHealAfter extends TDamageAfter{
    readonly hook:"造成治疗后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}
/**造成护盾后 */
export interface TCauseShieldAfter extends TDamageAfter{
    readonly hook:"造成护盾后";
    readonly trigger:(damage:Damage,target:Character)=>void;
}





//———————————————————— 攻击触发器 ————————————————————//
/**攻击前触发器 */
export interface TAttackBefore extends TriggerBase{
    readonly hook:`${"造成"|"受到"}${string}攻击前` & AnyHook;
    /**触发 攻击前 触发器
     * @param attack  攻击
     * @param victmin 受害者
     * @returns 修改的 攻击
     */
    readonly trigger:(attack:Attack,victmin:Character)=>Attack;
}
/**受到攻击前 */
export interface TTakeAttackBefore extends TAttackBefore{
    readonly hook:"受到攻击前";
    readonly trigger:(attack:Attack,victmin:Character)=>Attack;
}
/**造成攻击前 */
export interface TCauseAttackBefore extends TAttackBefore{
    readonly hook:"造成攻击前";
    readonly trigger:(attack:Attack, victmin:Character)=>Attack;
}
/**攻击后触发器 */
export interface TAttackAfter extends TriggerBase{
    readonly hook:`${"造成"|"受到"}${string}攻击后` & AnyHook;
    /**触发 攻击后 触发器
     * @param attack  攻击
     * @param victmin 受害者
     */
    readonly trigger:(attack:Attack,victmin:Character)=>void;
}
/**受攻击后 */
export interface TTakeAttackAfter extends TAttackAfter{
    readonly hook:"受到攻击后";
    readonly trigger:(attack:Attack,victmin:Character)=>void;
}
/**攻击后 */
export interface TCauseAttackAfter extends TAttackAfter{
    readonly hook:"造成攻击后";
    readonly trigger:(attack:Attack, victmin:Character)=>void;
}





//———————————————————— 技能触发器 ————————————————————//
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

//———————————————————— 其他触发器 ————————————————————//
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
/**回合结束前 */
export interface TRoundEndBefore extends TriggerBase{
    readonly hook:"回合结束前";
    /**触发 回合结束前 触发器
     * @param char       角色
     */
    readonly trigger:(char:Character)=>void;
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
    readonly 受到伤害前       : TTakeDamageBefore         ;
    readonly 受到伤害后       : TTakeDamageAfter          ;
    readonly 造成技能伤害前   : TCauseSkillDamageBefore   ;
    readonly 造成技能伤害后   : TCauseSkillDamageAfter    ;
    readonly 受到技能伤害前   : TTakeSkillDamageBefore    ;
    readonly 受到技能伤害后   : TTakeSkillDamageAfter     ;
    readonly 受到攻击前       : TTakeAttackBefore         ;
    readonly 受到攻击后       : TTakeAttackAfter          ;
    readonly 造成攻击前       : TCauseAttackBefore        ;
    readonly 造成攻击后       : TCauseAttackAfter         ;
    readonly 造成治疗前       : TCauseHealBefore          ;
    readonly 造成治疗后       : TCauseHealAfter           ;
    readonly 造成护盾前       : TCauseShieldBefore        ;
    readonly 造成护盾后       : TCauseShieldAfter         ;
    readonly 回合结束前       : TRoundEndBefore           ;
    readonly 获取效果层数后   : TGetBuffStackCountAfter   ;
};
export type AnyHook   = keyof HookTriggerMap;
export type AnyTrigger = HookTriggerMap[AnyHook];

