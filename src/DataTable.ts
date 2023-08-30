import { CharGener } from "./Character";
import { Buff, BuffName } from "./Modify";
import { Skill, SkillName } from "./Skill";
import { StaticStatusOption } from "./Status";

/**技能表 */
export const SkillTable:Record<SkillName,Skill> = {};
export const BuffTable:Record<BuffName,Buff> = {};
export const GlobalTiggerTable = {};


/**数据表 */
export type DataTable = Record<string,Buff|Skill|StaticStatusOption|CharGener>;

/**注册数据 */
export function regDataTable<T extends DataTable>(table:T):Readonly<T>{
    const dt = table as DataTable;
    for(const key in dt){
        const data = dt[key];
        if("info" in data){
            if("buffName" in data.info)
                BuffTable[data.info.buffName] = data as Buff;
            if("skillName" in data.info)
                SkillTable[data.info.skillName] = data as Skill;
        }
    }
    return table;
}
