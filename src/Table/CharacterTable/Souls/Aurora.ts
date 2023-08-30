import { Character } from "@src/Character";
import { Damage } from "@src/Damage";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, SkillData, checkTargets, genAttack, genSkillInfo } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";
import { genTriggerInfo } from "@src/Trigger";

export const Aurora = {
    失心童话:{
        info:genSkillInfo("技能:失心童话","雷电技能","伤害技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData:SkillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            user.addBuff(Aurora.噩廻,user.dynmaicStatus.当前怒气,1);
            user.dynmaicStatus.当前怒气=0;
            let atk = genAttack(skillData,1,"雷电伤害");
            for(let i=0;i<3;i++)
                targetList[0].getHit(atk);
            let count = user.buffTable.getBuffStack(Aurora.噩廻);
            if(count>=32)
                genAttack(skillData,count+(user.buffTable.getBuffStack(Aurora.电棘丛生B)),"雷电伤害");
        }
    } as Skill,
    噩廻:{
        info:genBuffInfo("效果:噩廻"),
        canSatck:true,
        stackMultModify: {
            攻击    :0.002,
        },
        stackAddModify:{
            伤害系数:0.03,
        },
        damageCons:["奥义技能","雷电技能"],
    } as Buff,
    /**荆雷奔袭技能 */
    荆雷奔袭:{
        info:genSkillInfo("技能:荆雷奔袭","雷电技能","伤害技能","单体技能","核心技能"),
        cost:16,
        cast(skillData:SkillData){
            const {user,targetList}=skillData;
            checkTargets(targetList,1,1);
            let atk = genAttack(skillData,0.9,"雷电伤害");
            for(let i=0;i<2;i++)
                targetList[0].getHit(atk);
            user.addBuff(Aurora.荆雷奔袭A,1,2);
        }
    } as Skill,
    /**荆雷奔袭攻击力效果 */
    荆雷奔袭A:{
        info:genBuffInfo("效果:荆雷奔袭A"),
        multModify:{
            雷电伤害:0.25,
        },
        damageCons:["雷电技能"],
    } as Buff,
    /**电棘丛生被动效果 */
    电棘丛生:{
        info:genBuffInfo("效果:电棘丛生"),
        triggerList:[{
            info:genTriggerInfo("触发:电棘丛生"),
            hook:"造成技能伤害前",
            trigger(damage:Damage){
                if(damage.source.char == null) return damage;
                let char = damage.source.char;
                if(char.getBuffStack(Aurora.电棘丛生B)<3)
                    char.addBuff(Aurora.电棘丛生A);
                if(char.getBuffStack(Aurora.电棘丛生A)>=3){
                    char.addBuff(Aurora.电棘丛生A,-3);
                    char.addBuff(Aurora.电棘丛生B, 1);
                }
                return damage;
            }
        }]
    } as Buff,
    /**电棘丛生攻击计数器 */
    电棘丛生A:{
        info:genBuffInfo("效果:电棘丛生A"),
        canSatck:true,
    } as Buff,
    /**电棘丛生攻击力效果 */
    电棘丛生B:{
        info:genBuffInfo("效果:电棘丛生B"),
        canSatck:true,
        stackLimit:3,
        stackMultModify:{
            攻击:0.05,
        }
    } as Buff,
    /**续存战意被动效果 */
    续存战意:{
        info:genBuffInfo("效果:续存战意"),
        triggerList:[{
            info:genTriggerInfo("触发:续存战意"),
            hook:"释放技能后",
            trigger(skillData:SkillData){
                const {user} = skillData;
                user.addBuff(Aurora.续存战意A);
                if(user.buffTable.getBuffStack(Aurora.续存战意A)>=5 && !user.buffTable.hasBuff(Aurora.续存战意B))
                    user.addBuff(Aurora.续存战意B);
                return skillData;
            }
        }]
    } as Buff,
    /**续存战意 每层效果 */
    续存战意A:{
        info:genBuffInfo("效果:续存战意A"),
        canSatck:true,
        stackLimit:5,
        stackMultModify:{
            攻击:0.015,
        }
    } as Buff,
    /**续存战意 5层效果 */
    续存战意B:{
        info:genBuffInfo("效果:续存战意B"),
        multModify:{
            攻击:0.075,
        }
    } as Buff,
    baseStatus:{
        攻击:10000
    } as StaticStatusOption,
    genChar(name?:string,status?:StaticStatusOption){
        let opt = Object.assign({},Aurora.baseStatus,status);
        let char = new Character(name||"Aurora",opt);
        char.addBuff(Aurora.续存战意);
        char.addBuff(Aurora.电棘丛生);
        return char;
    }
}
regDataTable(Aurora);