import { ModifyType } from "./Modify";
/**静态属性 */
export type StaticStatus = Record<ModifyType, number>;
/**默认的属性 */
export declare const DefStaticStatus: StaticStatusOption;
/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;
/**当前属性 */
export type DynmaicStatus = {
    /**当前生命 */
    当前生命: number;
    /**当前怒气 */
    当前怒气: number;
};
