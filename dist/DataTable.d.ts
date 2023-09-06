import { CharGener } from "./Character";
import { Buff, BuffGener, BuffName, StatusGener } from "./Modify";
import { Skill, SkillGener, SkillName } from "./Skill";
import { StaticStatus } from "./Status";
import { AnyTrigger } from "./Trigger";
/**所有的技能表 */
export declare const SkillDataTable: Record<SkillName, Skill>;
/**所有的效果表 */
export declare const BuffDataTable: Record<BuffName, Buff>;
export declare const GlobalTiggerTable: Record<string, AnyTrigger>;
/**数据表 */
export type DataTable = Record<string, Buff | Skill | StaticStatus | StatusGener | CharGener | SkillGener | BuffGener>;
/**注册数据 */
export declare function regDataTable<T extends DataTable>(table: T): Readonly<T>;
