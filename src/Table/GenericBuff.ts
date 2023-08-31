import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";

export namespace GenericBuff{
    export const 暗蚀:Buff={
        info: genBuffInfo("效果:暗蚀","负面效果"),
        canSatck:true,
        stackLimit:10,
        stackMultModify:{
            受到所有伤害:0.04,
        },
        damageCons:[],
    }
    export const 极寒:Buff={
        info: genBuffInfo("效果:极寒","负面效果"),
        canSatck:true,
        stackLimit:10,
        stackMultModify:{
            所有伤害:-0.03,
        },
        damageCons:[],
    }
}
regDataTable(GenericBuff);