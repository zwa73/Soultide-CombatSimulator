import { Character } from "@src/Character";
import { StaticStatusOption } from "@src/Status";

export namespace 稻草人{
    export const baseStatus:StaticStatusOption = {
        最大生命:490000,
        防御:2500,
    }
    export function genChar(status:StaticStatusOption):Character{
        let opt = Object.assign({},baseStatus,status);
        return new Character("稻草人",opt);
    }
}
