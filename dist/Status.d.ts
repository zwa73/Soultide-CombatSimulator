import { ModifyType } from "./Modify";
/**属性 */
export type Status = Record<ModifyType, number>;
/**属性 选项*/
export type StatusOption = Partial<Status>;
export type StaticStatus = Readonly<StatusOption>;
/**默认的属性 */
export declare const DefStatus: StaticStatus;
/**当前属性 */
export type DynmaicStatus = {
    /**当前生命 */
    当前生命: number;
    /**当前怒气 */
    当前怒气: number;
};
