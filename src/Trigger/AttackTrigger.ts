import { Attack, Character } from "..";
import { AnyHook, TriggerBase } from "./Trigger";


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