import { regDataTable } from "@src/DataTable";
import { Buff } from "@src/Modify";
import { Skill, genSkillInfo } from "@src/Skill";

export namespace Andrea{
    export const 极寒狙击:Skill={
        info:genSkillInfo("技能:极寒狙击","冰霜技能","伤害技能","单体技能","奥义技能"),
        cast(skillData){

        }
    }
    export const 寒霜:Buff={} as any;
}
regDataTable(Andrea);