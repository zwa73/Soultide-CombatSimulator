import { Character } from "./Character";
import { Damage } from "./Damage";
import { SkillData } from "./Skill";


export type TiggerBase={
    /**权重 默认0*/
    weight?:number;
    /**触发点 */
    hook:AnyHook;
    /**触发函数 */
    tigger(...args:any):any;
}

/**使用技能前 */
export interface TUseSkillBefore extends TiggerBase{
    hook:"释放技能后";
    /**触发 使用技能前 触发器
     * @param skillData 技能参数
     */
    tigger(skillData:SkillData):SkillData;
}
/**使用技能后 */
export interface TUseSkillAfter extends TiggerBase{
    hook:"释放技能前";
    /**触发 使用技能后 触发器
     * @param skillData 技能参数
     */
    tigger(skillData:SkillData):SkillData;
}
/**造成伤害前 */
export interface TDealDamageBefore extends TiggerBase{
    hook:"造成伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    tigger(damage:Damage,target:Character):Damage;
}
/**造成伤害后 */
export interface TDealDamageAfter extends TiggerBase{
    hook:"造成伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    tigger(damage:Damage,target:Character):Damage;
}
/**造成技能伤害前 */
export interface TDealSkillDamageBefore extends TiggerBase{
    hook:"造成技能伤害前";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    tigger(damage:Damage,target:Character):Damage;
}
/**造成技能伤害后 */
export interface TDealSkillDamageAfter extends TiggerBase{
    hook:"造成技能伤害后";
    /**触发 使用技能前 触发器
     * @param damage 伤害
     * @param target 伤害目标
     */
    tigger(damage:Damage,target:Character):Damage;
}


/**触发器表 */
export type HookTiggerMap = {
    释放技能后  :TUseSkillBefore    ;
    释放技能前  :TUseSkillAfter     ;
    造成伤害后  :TDealDamageBefore  ;
    造成伤害前  :TDealDamageAfter   ;
    造成技能伤害后  :TDealSkillDamageBefore  ;
    造成技能伤害前  :TDealSkillDamageAfter   ;
};
export type AnyHook   = keyof HookTiggerMap;
export type AnyTigger = HookTiggerMap[keyof HookTiggerMap];

