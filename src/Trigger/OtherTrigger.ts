import { Buff } from "@src/Modify";
import { TriggerBase } from "./Trigger";
import { AnyHook, Character } from "..";


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




//———————————————————— 回合 ————————————————————//
export interface TRound extends TriggerBase{
    readonly hook:`${"回合"}${string}`&AnyHook;
    /**触发 回合结束 触发器
     * @param round     回合数
     * @param char      角色
     */
    readonly trigger:(round:number,char:Character)=>void;
}
/**回合开始后 */
export interface TRoundStartAfter extends TRound{
    readonly hook:"回合开始后";
    readonly trigger:(round:number,char:Character)=>void;
}
/**回合结束前 */
export interface TRoundEndBefore extends TRound{
    readonly hook:"回合结束前";
    readonly trigger:(round:number,char:Character)=>void;
}



//———————————————————— 行动 ————————————————————//
export interface TTurn extends TriggerBase{
    readonly hook:`${"行动"}${string}`&AnyHook;
    /**触发 行动 触发器
     * @param char 角色
     */
    readonly trigger:(char:Character)=>void;
}
/**行动开始后 */
export interface TTurnStartAfter extends TTurn{
    readonly hook:"行动开始后";
    readonly trigger:(char:Character)=>void;
}
/**行动结束前 */
export interface TTurnEndBefore extends TTurn{
    readonly hook:"行动结束前";
    readonly trigger:(char:Character)=>void;
}



//———————————————————— 战斗 ————————————————————//
export interface TBattleStartAfter extends TriggerBase{
    readonly hook:"战斗开始后";
    readonly trigger:(char:Character)=>void;
}