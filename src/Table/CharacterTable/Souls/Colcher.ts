import { regDataTable } from "@src/DataTable";
import { Buff, BuffTable, genBuffInfo } from "@src/Modify";
import { Skill, genSkillInfo, procSTSkill } from "@src/Skill";
import { genTriggerInfo } from "@src/Trigger";

export namespace Colcher {
    export const 王女的祝福:Skill={
        info:genSkillInfo("技能:王女的祝福","魔法技能","辅助技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData){
            procSTSkill(skillData,(data)=>{
                const {user,target}=data;
                target.addBuff(Colcher.回音,1,2);
            })
        }
    }
    export const 回音:Buff={
        info:genBuffInfo("效果:回音","正面效果"),
        triggerList:[{
            info:genTriggerInfo("触发:回音"),
            hook:"释放技能后",
            weight:-Infinity,
            trigger(skillData){
                const {user,uid}=skillData;
                if(uid!=user.dataTable["回音技能注册"]) return;

                skillData.user.removeBuff(Colcher.回音);
                let bufftable = new BuffTable(skillData.user);
                bufftable.addBuff({
                    info:genBuffInfo("效果:回音奥义伤害减少","负面效果"),
                    multModify:{
                        奥义技能伤害:-0.4
                    }
                })
                skillData.user.triggerSkill(skillData.skill,skillData.targetList,{
                    buffTable:bufftable
                });
            }
        },{
            info:genTriggerInfo("触发:回音注册技能"),
            hook:"释放技能前",
            weight:-Infinity,
            trigger(skillData){
                const {user,uid,skill}=skillData;
                if(skill.info.skillName=="技能:王女的祝福") return skillData;
                if(skill.info.skillCategory != "奥义技能") return skillData;
                if(user.dataTable["回音技能注册"]!=null) return skillData;
                user.dataTable["回音技能注册"]=uid;
                return skillData;
            }
        }]
    }
}
regDataTable(Colcher);