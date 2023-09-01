import { genAttack } from "@src/Attack";
import { Character } from "@src/Character";
import { Damage } from "@src/Damage";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, SkillData, genSkillInfo, procSTSkill } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";
import { genTriggerInfo } from "@src/Trigger";

export namespace Aurora {
    export const 失心童话:Skill={
        info:genSkillInfo("技能:失心童话","雷电技能","伤害技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData:SkillData){
            const {user,targetList}=skillData;
            //获取上次子技能的数据
            let presubdata = undefined;
            if(user.hasBuff(噩廻)) presubdata = user.dataTable["上一次失心童话潜境"];
            else{
                user.addBuff(噩廻,user.dynmaicStatus.当前怒气,1);
                user.dynmaicStatus.当前怒气=0;
            }
            user.triggerSkill(失心童话伤害,targetList,presubdata);
        }
    }
    export const 失心童话伤害:Skill={
        info:genSkillInfo("技能:失心童话伤害","雷电技能","伤害技能","单体技能","奥义技能"),
        cast(skillData:SkillData){
            const {user,targetList}=skillData;
            //记录子技能数据
            user.dataTable["上一次失心童话潜境"] = skillData;
            /**随机目标 */
            const rdt = ()=>targetList[Math.floor(targetList.length*Math.random())];
            let atk = genAttack(skillData,1,"雷电伤害");
            for(let i=0;i<3;i++)
                rdt().getHit(atk);
            let count = user.getBuffStackCountAndT(噩廻);
            if(count>=32){
                let factor = 0.2+(user.getBuffStackCountAndT(电棘丛生效果)*0.2);
                let addatk = genAttack(skillData,factor,"雷电伤害");
                rdt().getHit(addatk);
            }
        }
    }
    export const 噩廻:Buff={
        info:genBuffInfo("效果:噩廻","正面效果"),
        canSatck:true,
        stackMultModify: {
            攻击    :0.002,
        },
        stackAddModify:{
            伤害系数:0.03,
        },
        damageCons:["奥义技能","雷电技能"],
    }
    /**荆雷奔袭技能 */
    export const 荆雷奔袭:Skill={
        info:genSkillInfo("技能:荆雷奔袭","雷电技能","伤害技能","单体技能","核心技能"),
        cost:16,
        cast(skillData:SkillData){
            procSTSkill(skillData,(data)=>{
                const {user,target}=data;
                let atk = genAttack(skillData,0.9,"雷电伤害");
                for(let i=0;i<2;i++)
                    target.getHit(atk);
                user.addBuff(荆雷奔袭效果,1,2);
            })
        }
    }
    /**荆雷奔袭攻击力效果 */
    export const 荆雷奔袭效果:Buff={
        info:genBuffInfo("效果:荆雷奔袭","正面效果"),
        multModify:{
            技能伤害:0.25,
        },
        damageCons:["雷电技能"],
    }
    /**电棘丛生技能 */
    export const 电棘丛生:Skill={
        info:genSkillInfo("技能:电棘丛生","雷电技能","被动技能","无范围技能","秘术技能"),
        triggerList:[{
            info:genTriggerInfo("触发:电棘丛生"),
            hook:"造成技能伤害后",
            trigger(damage:Damage){
                if(damage.source.char == null) return;
                let char = damage.source.char;
                const countFlag = "电荆丛生攻击计数";
                if(char.getBuffStackCountAndT(电棘丛生效果)<3){
                    if(char.dataTable[countFlag]==null)
                        char.dataTable[countFlag]=0;
                    char.dataTable[countFlag]+=1;
                }
                if(char.dataTable[countFlag]>=3){
                    char.dataTable[countFlag]=0;
                    char.addBuff(电棘丛生效果, 1);
                }
            }
        }]
    }
    /**电棘丛生攻击力效果 */
    export const 电棘丛生效果:Buff={
        info:genBuffInfo("效果:电棘丛生B","正面效果"),
        canSatck:true,
        stackLimit:3,
        stackMultModify:{
            攻击:0.05,
        }
    }
    /**续存战意被动效果 */
    export const 存续战意:Skill={
        info:genSkillInfo("技能:存续战意","其他技能","被动技能","无范围技能","特性技能"),
        triggerList:[{
            info:genTriggerInfo("触发:存续战意"),
            hook:"释放技能后",
            trigger(skillData:SkillData){
                const {user} = skillData;
                user.addBuff(存续战意效果);
            }
        }]
    }
    /**续存战意 每层效果 */
    export const 存续战意效果:Buff={
        info:genBuffInfo("效果:存续战意","正面效果"),
        canSatck:true,
        stackLimit:5,
        stackMultModify:{
            攻击:0.015,
        },
        specialModify(table) {
            const char = table.attacherChar;
            let atk = 0;
            if(char.getBuffStackCountAndT(存续战意效果)>=5)
                atk=0.075
            return{multModify:{
                攻击:atk
            }}
        },
    }
    export const baseStatus:StaticStatusOption = {
        攻击:10000
    }
    export function genChar(name?:string,status?:StaticStatusOption){
        let opt = Object.assign({},baseStatus,status);
        let char = new Character(name||"Aurora",opt);
        char.addSkill(存续战意);
        char.addSkill(电棘丛生);
        return char;
    }
}
regDataTable(Aurora);



