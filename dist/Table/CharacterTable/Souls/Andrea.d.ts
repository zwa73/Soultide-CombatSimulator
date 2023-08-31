import { Character } from "../../../Character";
import { Buff } from "../../../Modify";
import { Skill } from "../../../Skill";
import { StaticStatusOption } from "../../../Status";
export declare namespace Andrea {
    const 极寒狙击: Skill;
    const 寒霜: Buff;
    const baseStatus: StaticStatusOption;
    function genChar(name?: string, status?: StaticStatusOption): Character;
}
