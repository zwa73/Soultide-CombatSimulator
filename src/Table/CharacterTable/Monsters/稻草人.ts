import { CharGener, Character } from "@src/Character";
import { regDataTable } from "@src/DataTable";
import { StaticStatusOption } from "@src/Status";

export namespace 稻草人{
    export const baseStatus:StaticStatusOption = {
        最大生命:490000,
        防御:2500,
    }
    export const genChar:CharGener = function(name?,status?){
        let opt = Object.assign({},稻草人.baseStatus,status);
        return new Character(name||"稻草人",opt);
    }
}
regDataTable(稻草人);