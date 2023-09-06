import { SkillData } from "..";
import { AnyHook, TriggerBase } from "./Trigger";


//———————————————————— 技能触发器 ————————————————————//

/**技能前 */
export interface TSkillBefore extends TriggerBase{
    readonly hook:`${"释放"|"受到"}技能前`&AnyHook;
    /**触发 技能前 触发器
     * @param skillData 技能参数
     * @returns 修改的 技能参数
     */
    readonly trigger:(skillData:SkillData)=>SkillData;
}
/**释放技能前 */
export interface TUseSkillBefore extends TSkillBefore{
    readonly hook:"释放技能前";
    readonly trigger:(skillData:SkillData)=>SkillData;
}
/**受到技能前 */
export interface TTakeSkillBefore extends TSkillBefore{
    readonly hook:"受到技能前";
    readonly trigger:(skillData:SkillData)=>SkillData;
}



/**技能后 */
export interface TSkillAfter extends TriggerBase{
    readonly hook:`${"释放"|"受到"}技能后`&AnyHook;
    /**触发 技能后 触发器
     * @param skillData 技能参数
     * @returns 修改的 技能参数
     */
    readonly trigger:(skillData:SkillData)=>void;
}
/**释放技能后 */
export interface TUseSkillAfter extends TSkillAfter{
    readonly hook:"释放技能后";
    readonly trigger:(skillData:SkillData)=>void;
}
/**受到技能后 */
export interface TTakeSkillAfter extends TSkillAfter{
    readonly hook:"受到技能后";
    readonly trigger:(skillData:SkillData)=>void;
}