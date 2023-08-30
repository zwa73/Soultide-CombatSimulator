import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";

export const GenericBuff={
    暗蚀:{
        info: genBuffInfo("效果:暗蚀"),
        canSatck:true,
        stackLimit:10,
        stackMultModify:{
            受到所有伤害:0.04,
        },
        damageCons:[],
    } as Buff,
}
regDataTable(GenericBuff);