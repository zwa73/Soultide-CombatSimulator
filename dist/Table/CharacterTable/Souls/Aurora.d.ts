import { Character } from "../../../Character";
import { Buff } from "../../../Modify";
import { Skill } from "../../../Skill";
import { StaticStatusOption } from "../../../Status";
export declare namespace Aurora {
    const 失心童话: Skill;
    const 噩廻: Buff;
    /**荆雷奔袭技能 */
    const 荆雷奔袭: Skill;
    /**荆雷奔袭攻击力效果 */
    const 荆雷奔袭A: Buff;
    /**电棘丛生被动效果 */
    const 电棘丛生: Buff;
    /**电棘丛生攻击计数器 */
    const 电棘丛生A: Buff;
    /**电棘丛生攻击力效果 */
    const 电棘丛生B: Buff;
    /**续存战意被动效果 */
    const 续存战意: Buff;
    /**续存战意 每层效果 */
    const 续存战意A: Buff;
    /**续存战意 5层效果 */
    const 续存战意B: Buff;
    const baseStatus: StaticStatusOption;
    function genChar(status: StaticStatusOption): Character;
}
