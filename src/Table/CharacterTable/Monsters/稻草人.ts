import { CharGener, Character } from "@src/Character";
import { regDataTable } from "@src/DataTable";
import { StaticStatusOption } from "@src/Status";

export const 稻草人={
    baseStatus:{
        最大生命:490000,
        防御:2500,
    } as StaticStatusOption,
    genChar(name?:string,status?:StaticStatusOption):Character{
        let opt = Object.assign({},稻草人.baseStatus,status);
        return new Character(name||"稻草人",opt);
    }
}
regDataTable(稻草人);