import { regDataTable } from "@src/DataTable";
import { Buff, BuffTable, genBuffInfo } from "@src/Modify";
import { Skill, checkTargets, genSkillInfo } from "@src/Skill";
import { genTriggerInfo } from "@src/Trigger";

export namespace Colcher {
    export const 王女的祝福:Skill={
        info:genSkillInfo("技能:王女的祝福","魔法技能","辅助技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            targetList[0].addBuff(Colcher.回音,1,2);
        }
    }
    export const 回音:Buff={
        info:genBuffInfo("效果:回音","正面效果"),
        triggerList:[{
            info:genTriggerInfo("触发:回音"),
            hook:"释放技能后",
            weight:-Infinity,
            trigger(skillData){
                if(skillData.skill.info.skillName=="技能:王女的祝福") return;
                if(skillData.isTriggerSkill) return skillData;
                if(skillData.skill.info.skillCategory != "奥义技能") return;
                skillData.user.buffTable.removeBuff(Colcher.回音);
                let bufftable = new BuffTable();
                bufftable.addBuff({
                    info:genBuffInfo("效果:回音奥义伤害减少","负面效果"),
                    multModify:{
                        奥义技能伤害:-0.4
                    }
                })
                skillData.user.tiggerSkill(skillData.skill,skillData.targetList,{
                    buffTable:bufftable
                });
            }
        }]
    }
}
regDataTable(Colcher);