import { Buff } from "@src/Modify";

export namespace GeneralBuff{
    export const 暗蚀:Buff={
        name:"暗蚀",
        canSatck:true,
        stackLimit:10,
        stackMultModify:{
            所有伤害:0.04,
        },
        damageCons:["受击时"],
    }
}