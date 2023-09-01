import { Character } from "../../../Character";
import { Buff } from "../../../Modify";
import { Skill } from "../../../Skill";
import { StaticStatusOption } from "../../../Status";
export declare namespace Andrea {
    const 极寒狙击: Skill;
    const 寒霜: Buff;
    const 冷凝循环: Skill;
    const 冷凝循环效果: Buff;
    const 冷凝循环效果A: Buff;
    const 冻寒标记: Skill;
    const 冻寒标记效果: Buff;
    const baseStatus: StaticStatusOption;
    function genChar(name?: string, status?: StaticStatusOption): Character;
}
