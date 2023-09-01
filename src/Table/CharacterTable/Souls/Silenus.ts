import { GenericBuff } from "@GenericBuff";
import { genAttack } from "@src/Attack";
import { regDataTable } from "@src/DataTable";
import { Buff, genBuffInfo } from "@src/Modify";
import { Skill, genSkillInfo, procSTSkill } from "@src/Skill";
import { genTriggerInfo } from "@src/Trigger";

export namespace Silenus{
    export const 星尘余烬:Skill={
        info:genSkillInfo("技能:星尘余烬","冰霜技能","伤害技能","单体技能","奥义技能"),
        cost:64,
        cast(skillData) {
            procSTSkill(skillData,(data)=>{
                const {target} = data;
                target.addBuff(极寒诅咒,1,2);
                let atk = genAttack(skillData,3.6,"冰霜伤害");
                target.getHit(atk);
            })
        },
    }
    export const 极寒诅咒:Buff={
        info:genBuffInfo("效果:极寒诅咒","负面效果"),
        triggerList:[{
            info:genTriggerInfo("触发:极寒诅咒"),
            hook:"获取效果层数后",
            trigger(char, buff, stackCount) {
                if(buff === GenericBuff.极寒)
                    return stackCount*2;
                return stackCount;
            },
        }],
        specialModify(table) {
            const char = table.attacherChar;
            let dmg = char.getBuffStackCountAndT(GenericBuff.极寒)*0.02;
            return{multModify:{
                受到所有伤害:dmg
            }}
        },
    }
    export const 寂灭昭示:Skill={
        info:genSkillInfo("技能:寂灭昭示","冰霜技能","伤害技能","单体技能","秘术技能"),
        cost:24,
        cast(skillData) {
            procSTSkill(skillData,(data)=>{
                const {target} = data;
                target.addBuff(寂灭昭示效果,1,2);
                let atk = genAttack(skillData,2.1,"冰霜伤害");
                target.getHit(atk);
            })
        },
    }
    export const 寂灭昭示效果:Buff={
        info:genBuffInfo("效果:寂灭昭示","负面效果"),
        specialModify(table) {
            const char = table.attacherChar;
            let dmg = 0.1;
            if(char.getBuffStackCountAndT(GenericBuff.极寒)>=5)
                dmg += 0.1;
            return{multModify:{
                受到冰霜伤害:dmg
            }}
        },
    }
    export const 能流感知:Skill={
        info:genSkillInfo("技能:能流感知","其他技能","被动技能","无范围技能","特性技能"),
        triggerList:[{
            info:genTriggerInfo("触发:能流感知"),
            hook:"造成类型伤害后",
            damageCons:["冰霜技能"],
            trigger(damage, target) {
                target.addBuff(能流感知效果,target.getBuffStackCountAndT(GenericBuff.极寒),1);
                return damage;
            },
        }]
    }
    export const 能流感知效果:Buff={
        info:genBuffInfo("效果:能流感知","负面效果"),
        stackMultModify:{
            受到穿透防御:0.01
        }
    }
}
regDataTable(Silenus);