import { Character } from "../../../Character";
import { StaticStatusOption } from "../../../Status";
export declare namespace 稻草人 {
    const baseStatus: StaticStatusOption;
    function genChar(status: StaticStatusOption): Character;
}
