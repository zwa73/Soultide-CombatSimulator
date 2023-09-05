import { SkillData } from "..";
import { TriggerBase } from "./Trigger";
/**释放技能前 */
export interface TUseSkillBefore extends TriggerBase {
    readonly hook: "释放技能前";
    /**触发 使用技能前 触发器
     * @param skillData 技能参数
     * @returns 修改的 技能参数
     */
    readonly trigger: (skillData: SkillData) => SkillData;
}
/**释放技能后 */
export interface TUseSkillAfter extends TriggerBase {
    readonly hook: "释放技能后";
    /**触发 使用技能后 触发器
     * @param skillData 技能参数
     */
    readonly trigger: (skillData: SkillData) => void;
}
