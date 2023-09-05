import { GenericBuff } from "@GenericBuff";
import { CharGener, Character } from "@src/Character";
import { regDataTable } from "@src/DataTable";
import { StaticStatusOption } from "@src/Status";

export namespace 稻草人{
    export const baseStatus:StaticStatusOption = {
        最大生命:490000,
        防御:2500,
    }
    export const genChar:CharGener = function(name?,status?){
        let opt = Object.assign({},baseStatus,status);
        let 稻草人 = new Character(name||"稻草人",opt);
        稻草人._buffTable.addBuff(GenericBuff.全弱点Gen(8));
        return 稻草人;
    }
}
regDataTable(稻草人);