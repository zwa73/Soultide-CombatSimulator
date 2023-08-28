import { Buff } from "./Modify";
import { Skill, checkTargets, genSkillInfo } from "./Skill";

export namespace Colcher{
    export const 王女的祝福:Skill={
        info:genSkillInfo("技能:王女的祝福","魔法技能","其他技能","单体","奥义"),
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            targetList[0].addBuff(回音);
        }
    }
    export const 回音:Buff={
        name:"回音",
        tiggerList:[{
            hook:"释放技能后",
            tigger(skillData){
                if(skillData.skill.info.skillName=="技能:王女的祝福") return skillData;
                skillData.user.buffTable.removeBuff(回音.name);
                skillData.user.tiggerSkill(skillData.skill,skillData.targetList);
                return skillData;
            }
        }]
    }
}