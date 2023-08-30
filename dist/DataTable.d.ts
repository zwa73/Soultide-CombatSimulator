import { CharGener } from "./Character";
import { Buff, BuffName } from "./Modify";
import { Skill, SkillName } from "./Skill";
import { StaticStatusOption } from "./Status";
/**技能表 */
export declare const SkillTable: Record<SkillName, Skill>;
export declare const BuffTable: Record<BuffName, Buff>;
export declare const GlobalTiggerTable: {};
/**数据表 */
export type DataTable = Record<string, Buff | Skill | StaticStatusOption | CharGener>;
/**注册数据 */
export declare function regDataTable<T extends DataTable>(table: T): Readonly<T>;
