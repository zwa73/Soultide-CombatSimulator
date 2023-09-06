import { ModifyType } from "./Modify";

//———————————————————— 属性 ————————————————————//



/**属性 */
export type Status=Record<ModifyType,number>;

/**属性 选项*/
export type StatusOption = Partial<Status>;

export type StaticStatus = Readonly<StatusOption>
/**默认的属性 */
export const DefStatus:StaticStatus={
    最大生命    :1   ,
    暴击率      :0.05,
    暴击伤害    :1.5 ,
    初始怒气    :48  ,
    最大怒气    :120 ,
    怒气回复    :16  ,
};


/**当前属性 */
export type DynmaicStatus={
    /**当前生命 */
    当前生命:number;
    /**当前怒气 */
    当前怒气:number;
}

