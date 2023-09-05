import { TCauseDamageAfter, TCauseDamageBefore, TCauseHealAfter, TCauseHealBefore, TCauseShieldAfter, TCauseShieldBefore, TCauseSkillDamageAfter, TCauseSkillDamageBefore, TTakeDamageAfter, TTakeDamageBefore, TTakeSkillDamageAfter, TTakeSkillDamageBefore } from "..";
import { TCauseAttackAfter, TCauseAttackBefore, TTakeAttackAfter, TTakeAttackBefore } from "./AttackTrigger";
import { TGetBuffStackCountAfter, TRoundEndBefore } from "./OtherTrigger";
import { TUseSkillAfter, TUseSkillBefore } from "./SkillTrigger";

export type TriggerBase={
    readonly info:TriggerInfo;
    /**触发点 */
    readonly hook:AnyHook;
    /**权重 默认0*/
    readonly weight?:number;
    /**触发函数 */
    readonly trigger: (...args:any)=>any;
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

