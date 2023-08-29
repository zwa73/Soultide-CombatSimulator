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

/**触发器表 */
export type HookTiggerMap = {
    释放技能后  :TUseSkillBefore;
    释放技能前  :TUseSkillAfter ;

};
export type AnyHook   = keyof HookTiggerMap;
export type AnyTigger = HookTiggerMap[keyof HookTiggerMap];

