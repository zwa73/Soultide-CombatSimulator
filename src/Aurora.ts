import { Buff } from "./Modify";
import { Skill, checkTargets, genAttack, genSkillInfo } from "./Skill";

export namespace Aurora{
    export const 失心童话:Skill={
        info:genSkillInfo("技能:失心童话","雷电技能","伤害技能","单体","奥义"),
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            user.addBuff(噩廻,user.dynmaicStatus.当前怒气);
            user.dynmaicStatus.当前怒气=0;
            let atk = genAttack(this.info,skillData,1,"雷电");
            for(let i=0;i<3;i++)
                targetList[0].getHit(atk);
        }
    }
    const 噩廻:Buff={
        name:"噩廻",
        canSatck:true,
        stackMultModify: {
            攻击    :0.002,
        },
        stackAddModify:{
            伤害系数:0.03,
        },
        damageConstraint:["奥义","雷电技能"] as const,
    };
}