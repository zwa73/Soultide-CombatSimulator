import { Buff } from "./CombatSimulation";
import { Skill, genAttack, genSkillInfo } from "./Skill";

export namespace Aurora{
    export const 失心童话:Skill={
        info:genSkillInfo("雷电技能","单体","奥义"),
        use(skillData){
            const {user}=skillData;
            user.addBuff(噩廻,user.dynmaicStatus.energy);
            user.dynmaicStatus.energy=0;
            user.useSkill(失心童话Sub,skillData.target);
        }
    }
    export const 失心童话Sub:Skill={
        info:genSkillInfo("雷电技能","单体","奥义"),
        use(skillData){
            let atk = genAttack(this.info,skillData,1,"雷电");
            for(let i=0;i<3;i++)
                skillData.target![0].getHit(atk);
        }
    }
    const 噩廻:Buff={
        name:"噩廻",
        canSatck:true,
        stackModifyOnDamages: [{
            number:0.03,
            modifyType:"伤害系数",
            constraint:["奥义","雷电技能"],
        },{
            number:0.002,
            modifyType:"攻击力",
            constraint:["奥义","雷电技能"],
        }]
    }
}