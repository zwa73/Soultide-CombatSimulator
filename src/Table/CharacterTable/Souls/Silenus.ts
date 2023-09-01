import { GenericBuff } from "@GenericBuff";
import { genAttack } from "@src/Attack";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, genSkillInfo, procSTSkill } from "@src/Skill";
import { genTriggerInfo } from "@src/Trigger";

export namespace Silenus{
    export const 寂灭昭示:Skill={
        info:genSkillInfo("技能:Silenus","冰霜技能","伤害技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData) {
            procSTSkill(skillData,(data)=>{
                const {target} = data;
                target.addBuff(寂灭昭示效果,1,2);
                let atk = genAttack(skillData,3.6,"冰霜伤害");
                target.getHit(atk);
            })
        },
    }
    export const 寂灭昭示效果:Buff={
        info:genBuffInfo("效果:寂灭昭示","负面效果"),
        triggerList:[{
            info:genTriggerInfo("触发:寂灭昭示"),
            hook:"获取效果层数后",
            trigger(char, buff, stackCount) {
                if(buff === GenericBuff.极寒)
                    return stackCount*2;
                return stackCount;
            },
        }]
    }
}
regDataTable(Silenus);