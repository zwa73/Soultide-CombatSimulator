import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { DamageType, SkillType, genTriggerInfo } from "..";


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
    export const 弱点Gen = (lvl=1,...dmgCons:SkillType[]):Buff=>{
        const 弱点:Buff={
            info:genBuffInfo("效果:弱点","其他效果"),
            triggerList:[{
                info:genTriggerInfo("触发:弱点"),
                weight:Infinity,
                hook:"受到技能伤害后",
                damageCons:[[...dmgCons]],
                trigger(damage, target) {
                    if(target.dataTable["弱点层数"]==null)
                        target.dataTable["弱点层数"] = lvl;
                    if(!target.hasBuff(弱点击破)){
                        let count = (target.dataTable["弱点层数"] as number);
                        target.dataTable["弱点层数"]= --count;
                        if(count<=0){
                            target.addBuff(弱点击破,1,2);
                            target.dataTable["弱点层数"] = lvl;
                        }
                    }
                },
            }]
        }
        return 弱点;
    }
    export const 全弱点Gen = (lvl=1):Buff=>{
        return 弱点Gen(lvl,"冰霜技能","火焰技能","物理技能","雷电技能","魔法技能","无类型技能");
    }
    export const 弱点击破:Buff={
        info: genBuffInfo("效果:弱点击破","其他效果"),
        triggerList:[{
            info:genTriggerInfo("触发:弱点击破"),
            weight:Infinity,
            hook:"受到伤害前",
            trigger(damage, target) {
                damage.magnification*=2;
                return damage;
            },
        }]
    }
}
regDataTable(GenericBuff);