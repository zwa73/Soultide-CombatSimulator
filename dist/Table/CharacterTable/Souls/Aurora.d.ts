import { Character } from "../../../Character";
import { Buff } from "../../../Modify";
import { Skill } from "../../../Skill";
import { StaticStatusOption } from "../../../Status";
export declare const Aurora: {
    失心童话: Skill;
    噩廻: Buff;
    /**荆雷奔袭技能 */
    荆雷奔袭: Skill;
    /**荆雷奔袭攻击力效果 */
    荆雷奔袭A: Buff;
    /**电棘丛生被动效果 */
    电棘丛生: Buff;
    /**电棘丛生攻击计数器 */
    电棘丛生A: Buff;
    /**电棘丛生攻击力效果 */
    电棘丛生B: Buff;
    /**续存战意被动效果 */
    续存战意: Buff;
    /**续存战意 每层效果 */
    续存战意A: Buff;
    /**续存战意 5层效果 */
    续存战意B: Buff;
    baseStatus: Partial<import("../../../Status").StaticStatus>;
    genChar(name?: string, status?: StaticStatusOption): Character;
};
