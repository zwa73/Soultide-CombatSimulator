import { Buff } from "../Modify";
import { TriggerBase } from "./Trigger";
import { Character } from "..";
/**获取效果层数后 */
export interface TGetBuffStackCountAfter extends TriggerBase {
    readonly hook: "获取效果层数后";
    /**触发 使用技能前 触发器
     * @param char       角色
     * @param buff       获取的效果
     * @param stackCount 获取的效果层数
     * @returns 修改的 获取的效果层数
     */
    readonly trigger: (char: Character, buff: Buff, stackCount: number) => number;
}
/**回合结束前 */
export interface TRoundEndBefore extends TriggerBase {
    readonly hook: "回合结束前";
    /**触发 回合结束前 触发器
     * @param char       角色
     */
    readonly trigger: (char: Character) => void;
}
