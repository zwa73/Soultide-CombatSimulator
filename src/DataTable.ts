import { CharGener } from "./Character";
import { Buff, BuffName } from "./Modify";
import { Skill, SkillName } from "./Skill";
import { StaticStatusOption } from "./Status";
import { AnyTrigger } from "./Trigger";

/**所有的技能表 */
export const SkillDataTable:Record<SkillName,Skill> = {};
/**所有的效果表 */
export const BuffDataTable:Record<BuffName,Buff> = {};
export const GlobalTiggerTable:Record<string,AnyTrigger> = {};


/**数据表 */
export type DataTable = Record<string,Buff|Skill|StaticStatusOption|CharGener>;

/**注册数据 */
export function regDataTable<T extends DataTable>(table:T):Readonly<T>{
    const dt = table as DataTable;
    for(const key in dt){
        const data = dt[key];
        if("info" in data){
            if("buffName" in data.info)
                BuffDataTable[data.info.buffName] = data as Buff;
            if("skillName" in data.info)
                SkillDataTable[data.info.skillName] = data as Skill;
        }
    }
    return table;
}
