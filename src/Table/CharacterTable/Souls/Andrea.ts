import { GenericBuff } from "@GenericBuff";
import { genAttack } from "@src/Attack";
import { Character } from "@src/Character";
import { genNonSkillDamage } from "@src/Damage";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, genSkillInfo, procSTSkill } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";
import { genTriggerInfo } from "@src/Trigger";

//const {skill,user,targetList,battlefield,buffTable,
//  isTriggerSkill,dataTable,uid}=skillData;
export namespace Andrea{
    export const 极寒狙击:Skill={
        info:genSkillInfo("技能:极寒狙击","冰霜技能","伤害技能","单体技能","奥义技能"),
        cast(skillData){
            procSTSkill(skillData,(data)=>{
                const {skill,user,target,uid}=data;
                target.addBuff(寒霜,target.getBuffStackCount(GenericBuff.极寒));
                let atk = genAttack(skillData,3.6,"冰霜伤害","所有伤害");
                target.getHit(atk);
            })
        }
    };
    export const 寒霜:Buff={
        info:genBuffInfo("效果:寒霜","负面效果"),
        canSatck:true,
        triggerList:[{
            info:genTriggerInfo("触发:寒霜"),
            hook:"受攻击后",
            trigger(attack, victmin) {
                if(attack.source.skillData.skill.info.skillName!="技能:极寒狙击") return;
                let count = victmin.getBuffStackCount(寒霜);
                let factor = count*(count*0.0001+0.02);
                let dmg = genNonSkillDamage(factor,"极寒伤害","所有伤害",attack.source.char);
                victmin.getHurt(dmg);
            },
        }]
    };
    export const 冷凝循环:Skill={
        info:genSkillInfo("技能:冷凝循环","冰霜技能","被动技能","无范围技能","秘术技能"),
        triggerList:[{
            info:genTriggerInfo("触发:冷凝循环"),
            hook:"攻击前",
            trigger(attack, victmin) {
                let stack = victmin.getBuffStackCount(GenericBuff.极寒);
                attack.source.char.addBuff(冷凝循环效果,stack,1);
                if(stack>=10)
                    attack.source.char.addBuff(冷凝循环效果A,1,1);
                return attack;
            },
        }]
    }
    export const 冷凝循环效果:Buff={
        info:genBuffInfo("效果:冷凝循环","正面效果"),
        stackMultModify:{
            攻击:0.015
        }
    }
    export const 冷凝循环效果A:Buff={
        info:genBuffInfo("效果:冷凝循环A","正面效果"),
        stackMultModify:{
            攻击:0.1
        }
    }
    export const 冻寒标记:Skill={
        info:genSkillInfo("技能:冻寒标记","无类型技能","被动技能","无范围技能","特性技能"),
        triggerList:[{
            info:genTriggerInfo("触发:冻寒标记"),
            hook:"攻击前",
            trigger(attack, victmin) {
                let stack = victmin.getBuffStackCount(GenericBuff.极寒);
                attack.source.char.addBuff(冻寒标记效果,stack);
                return attack;
            },
        }]
    }
    export const 冻寒标记效果:Buff={
        info:genBuffInfo("效果:冻寒标记","正面效果"),
        canSatck:true,
        stackLimit:10,
        stackMultModify:{
            冰霜伤害:0.03
        }
    }
    export const baseStatus:StaticStatusOption = {
        攻击:10000
    };
    export function genChar(name?:string,status?:StaticStatusOption){
        let opt = Object.assign({},baseStatus,status);
        let char = new Character(name||"Andrea",opt);
        char.addSkill(冷凝循环);
        char.addSkill(冻寒标记);
        return char;
    }
}
regDataTable(Andrea);