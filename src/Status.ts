import { ModifyType } from "./Modify";

//———————————————————— 属性 ————————————————————//



/**静态属性 */
export type StaticStatus=Record<ModifyType,number>;


/**默认的属性 */
export const DefStaticStatus:StaticStatusOption={
    最大生命    :1   ,
    暴击率      :0.05,
    暴击伤害    :1.5 ,
    初始怒气    :48  ,
    最大怒气    :120 ,
    怒气回复    :16  ,
};


/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;

/**当前属性 */
export type DynmaicStatus={
    /**当前生命 */
    当前生命:number;
    /**当前怒气 */
    当前怒气:number;
}

