import { Character } from "@src/Character";
import { Buff } from "@src/Modify";
import { Skill, checkTargets, genAttack, genSkillInfo } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";

export namespace Aurora{
    export const 失心童话:Skill={
        info:genSkillInfo("技能:失心童话","雷电技能","伤害技能","单体","奥义"),
        cost:64,
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            user.addBuff(噩廻,user.dynmaicStatus.当前怒气,1);
            user.dynmaicStatus.当前怒气=0;
            let atk = genAttack(this,skillData,1,"雷电伤害");
            for(let i=0;i<3;i++)
                targetList[0].getHit(atk);
        }
    }
    export const 噩廻:Buff={
        name:"噩廻",
        canSatck:true,
        stackMultModify: {
            攻击    :0.002,
        },
        stackAddModify:{
            伤害系数:0.03,
        },
        damageCons:["奥义","雷电技能"],
    };
    /**荆雷奔袭技能 */
    export const 荆雷奔袭:Skill={
        info:genSkillInfo("技能:荆雷奔袭","雷电技能","伤害技能","单体","核心"),
        cost:16,
        cast(skillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            let atk = genAttack(this,skillData,0.9,"雷电伤害");
            for(let i=0;i<2;i++)
                targetList[0].getHit(atk);
            user.addBuff(荆雷奔袭A,1,2);
        }
    }
    /**荆雷奔袭攻击力效果 */
    export const 荆雷奔袭A:Buff={
        name:"荆雷奔袭A",
        multModify:{
            雷电伤害:0.25,
        },
        damageCons:["雷电技能"]
    };
    /**电棘丛生被动效果 */
    export const 电棘丛生:Buff={
        name:"电棘丛生",
        tiggerList:[{
            hook:"造成技能伤害前",
            tigger(skillData){
                if(skillData.source.char == null) return skillData;
                let char = skillData.source.char;
                if(char.buffTable.getBuffStack(电棘丛生B)<3)
                    char.addBuff(电棘丛生A);
                if(char.buffTable.getBuffStack(电棘丛生A)>=3){
                    char.buffTable.addBuff(电棘丛生A,-3);
                    char.buffTable.addBuff(电棘丛生B, 1);
                }
                return skillData;
            }
        }]
    };
    /**电棘丛生攻击计数器 */
    export const 电棘丛生A:Buff={
        name:"电棘丛生A",
        canSatck:true,
    };
    /**电棘丛生攻击力效果 */
    export const 电棘丛生B:Buff={
        name:"电棘丛生B",
        canSatck:true,
        stackLimit:3,
        stackMultModify:{
            攻击:0.05,
        }
    };
    /**续存战意被动效果 */
    export const 续存战意:Buff={
        name:"续存战意",
        tiggerList:[{
            hook:"释放技能后",
            tigger(skillData){
                const {user} = skillData;
                user.addBuff(续存战意A);
                if(user.buffTable.getBuffStack(续存战意A)>=5 && !user.buffTable.hasBuff(续存战意B))
                    user.addBuff(续存战意B);
                return skillData;
            }
        }]
    };
    /**续存战意 每层效果 */
    export const 续存战意A:Buff={
        name:"续存战意A",
        canSatck:true,
        stackLimit:5,
        stackMultModify:{
            攻击:0.015,
        }
    };
    /**续存战意 5层效果 */
    export const 续存战意B:Buff={
        name:"续存战意B",
        multModify:{
            攻击:0.075,
        }
    };
    export const baseStatus:StaticStatusOption = {
        攻击:10000
    }
    export function genChar(status:StaticStatusOption){
        let opt = Object.assign({},baseStatus,status);
        let char = new Character("Aurora",opt);
        char.addBuff(续存战意);
        char.addBuff(电棘丛生);
        return char;
    }
}