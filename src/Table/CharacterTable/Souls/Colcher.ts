import { Buff } from "@src/Modify";
import { Skill, checkTargets, genSkillInfo } from "@src/Skill";

export namespace Colcher{
    export const 王女的祝福:Skill={
        info:genSkillInfo("技能:王女的祝福","魔法技能","辅助技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            targetList[0].addBuff(回音,1,2);
        }
    }
    export const 回音:Buff={
        name:"状态:回音",
        tiggerList:[{
            hook:"释放技能后",
            weight:-1000,
            tigger(skillData){
                if(skillData.skill.info.skillName=="技能:王女的祝福") return skillData;
                if(skillData.isTiggerSkill) return skillData;
                if(skillData.skill.info.skillCategory != "奥义技能") return skillData;
                skillData.user.buffTable.removeBuff(回音);
                skillData.user.tiggerSkill(skillData.skill,skillData.targetList);
                return skillData;
            }
        }]
    }
}