import { DamageConsAnd } from "@src/Modify";
import { AnyHook, Character, Damage, TriggerBase } from "..";


//———————————————————— 伤害触发器 ————————————————————//



//———————————————————— 伤害前 ————————————————————//
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



//———————————————————— 伤害后 ————————————————————//
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