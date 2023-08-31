import { CharGener } from "./Character";
import { Buff, BuffName } from "./Modify";
import { Skill, SkillName } from "./Skill";
import { StaticStatusOption } from "./Status";
import { AnyTrigger } from "./Trigger";
/**所有的技能表 */
export declare const SkillDataTable: Record<SkillName, Skill>;
/**所有的效果表 */
export declare const BuffDataTable: Record<BuffName, Buff>;
export declare const GlobalTiggerTable: Record<string, AnyTrigger>;
/**数据表 */
export type DataTable = Record<string, Buff | Skill | StaticStatusOption | CharGener>;
/**注册数据 */
export declare function regDataTable<T extends DataTable>(table: T): Readonly<T>;
