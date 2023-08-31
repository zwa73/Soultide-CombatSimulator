import { GenericBuff } from "@GenericBuff";
import { genAttack } from "@src/Attack";
import { Character } from "@src/Character";
import { genNonSkillDamage } from "@src/Damage";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, genSkillInfo, procSTSkill } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";
import { genTriggerInfo } from "@src/Trigger";

//const {skill,user,targetList,battlefield,buffTable,
//  isTriggerSkill,dataTable,uid}=skillData;
export namespace Andrea{
    export const 极寒狙击:Skill={
        info:genSkillInfo("技能:极寒狙击","冰霜技能","伤害技能","单体技能","奥义技能"),
        cast(skillData){
            procSTSkill(skillData,(data)=>{
                const {skill,user,target,uid}=data;
                target.addBuff(寒霜,target.getBuffStackCountAndT(GenericBuff.极寒));
                let atk = genAttack(skillData,3.6,"冰霜伤害");
                target.getHit(atk);
            })
        }
    };
    export const 寒霜:Buff={
        info:genBuffInfo("效果:寒霜","负面效果"),
        canSatck:true,
        triggerList:[{
            info:genTriggerInfo("触发:寒霜"),
            hook:"受攻击后",
            trigger(victmin, attack) {
                if(attack.source.skillData.skill.info.skillName!="技能:极寒狙击") return;
                let count = victmin.getBuffStackCountAndT(寒霜);
                let factor = count*(count*0.0001+0.02);
                let dmg = genNonSkillDamage(factor,"极寒伤害",attack.source.char);
                victmin.getHurt(dmg);
            },
        }]
    };
    export const baseStatus:StaticStatusOption = {
        攻击:10000
    };
    export function genChar(name?:string,status?:StaticStatusOption){
        let opt = Object.assign({},baseStatus,status);
        let char = new Character(name||"Andrea",opt);
        return char;
    }
}
regDataTable(Andrea);