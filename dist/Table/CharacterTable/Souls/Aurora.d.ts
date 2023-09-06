import { CharGener } from "@src/Character";
import { Buff } from "@src/Modify";
import { Skill } from "@src/Skill";
import { StaticStatusOption } from "@src/Status";
export declare namespace Aurora {
    const 失心童话: Skill;
    const 失心童话伤害: Skill;
    const 噩廻: Buff;
    /**荆雷奔袭技能 */
    const 荆雷奔袭: Skill;
    /**荆雷奔袭攻击力效果 */
    const 荆雷奔袭效果: Buff;
    /**电棘丛生技能 */
    const 电棘丛生: Skill;
    /**电棘丛生攻击力效果 */
    const 电棘丛生效果: Buff;
    /**续存战意被动效果 */
    const 存续战意: Skill;
    /**续存战意 每层效果 */
    const 存续战意效果: Buff;
    const baseStatus: StaticStatusOption;
    const genChar: CharGener;
}
