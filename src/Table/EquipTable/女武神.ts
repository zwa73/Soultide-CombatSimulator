import { regDataTable } from "@src/DataTable";
import { Buff, BuffGener, genBuffInfo } from "@src/Modify";
import { GenericEquip, fiXlvl } from "./GenericEquip";
import { genTriggerInfo } from "@src/Trigger";

export namespace 女武神{
    export const 女武神Gen:BuffGener = function (lvl?){
        const 神威 = 神威Gen(lvl);
        return {
            info:genBuffInfo("效果:女武神蕴灵","其他效果"),
            addModify:GenericEquip.攻击蕴灵属性Gen(lvl),
            triggerList:[{
                info:genTriggerInfo("触发:女武神"),
                hook:"造成攻击后",
                trigger(attack, victmin) {
                    attack.source.char.addBuff(神威);
                },
            }]
        }
    }
    export const 神威Gen:BuffGener = function (lvl?){
        return {
            info:genBuffInfo("效果:神威","正面效果"),
            canSatck:true,
            stackLimit:([6,8,10,12,15])[fiXlvl(lvl)-1],
            stackMultModify:{
                攻击:0.02
            }
        }
    }
}
regDataTable(女武神);