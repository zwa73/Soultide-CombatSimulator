import { SkillData } from "./Skill";
export type TiggerBase = {
    /**权重 */
    weight: number;
    /**触发点 */
    hook: AnyHook;
    /**触发函数 */
    tigger(...args: any): any;
};
/**使用技能前 */
export interface TUseSkillBefore extends TiggerBase {
    hook: "UseSkillBefore";
    /**触发 使用技能前 触发器
     * @param SkillData 技能参数
     */
    tigger(skillData: SkillData): SkillData;
}
/**使用技能后 */
export interface TUseSkillAfter extends TiggerBase {
    hook: "UseSkillAfter";
    /**触发 使用技能后 触发器
     * @param SkillData 技能参数
     */
    tigger(skillData: SkillData): SkillData;
}
/**触发器表 */
export type HookTiggerMap = {
    UseSkillBefore: TUseSkillBefore;
    UseSkillAfter: TUseSkillAfter;
};
export type AnyHook = keyof HookTiggerMap;
export type AnyTigger = HookTiggerMap[keyof HookTiggerMap];
