import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, checkTargets, genSkillInfo } from "@src/Skill";

export const Colcher = {
    王女的祝福:{
        info:genSkillInfo("技能:王女的祝福","魔法技能","辅助技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            targetList[0].addBuff(Colcher.回音,1,2);
        }
    } as Skill,
    回音:{
        info:genBuffInfo("状态:回音"),
        tiggerList:[{
            hook:"释放技能后",
            weight:-1000,
            tigger(skillData){
                if(skillData.skill.info.skillName=="技能:王女的祝福") return skillData;
                if(skillData.isTiggerSkill) return skillData;
                if(skillData.skill.info.skillCategory != "奥义技能") return skillData;
                skillData.user.buffTable.removeBuff(Colcher.回音);
                skillData.user.tiggerSkill(skillData.skill,skillData.targetList);
                return skillData;
            }
        }]
    } as Buff,
}
regDataTable(Colcher);