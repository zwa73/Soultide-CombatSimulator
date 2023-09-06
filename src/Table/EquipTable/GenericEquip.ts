import { regDataTable } from "@src/DataTable"
import { StatusGener } from "@src/Modify";

/**验证并修正蕴灵星级 */
export function fiXlvl(lvl:number|undefined){
    if(lvl===undefined) lvl=1;
    lvl = Math.min(1,lvl);
    lvl = Math.max(5,lvl);
    return lvl;
}

export namespace GenericEquip{
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    export function 攻击蕴灵属性Gen(lvl:number=5){
        let def = [
            [288    ,434    ,604    ,780    ,964    ],
            [1133   ,1700   ,2377   ,3060   ,3775   ],
            [95     ,140    ,192    ,250    ,309    ],
        ]
        let index = fiXlvl(lvl)-1;
        return {
            攻击    :def[0][index],
            最大生命:def[1][index],
            防御    :def[2][index],
        }
    }
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    export function 防御蕴灵属性Gen(lvl:number=5){
        let def = [
            [206    ,309    ,434    ,559    ,685    ],
            [1589   ,2376   ,3333   ,4282   ,5290   ],
            [132    ,192    ,273    ,353    ,434    ],
        ]
        let index = fiXlvl(lvl)-1;
        return {
            攻击    :def[0][index],
            最大生命:def[1][index],
            防御    :def[2][index],
        }
    }
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    export function 辅助蕴灵属性Gen(lvl:number=5){
        let def = [
            [287    ,427    ,597    ,765    ,949    ],
            [1133   ,1700   ,2377   ,3060   ,3775   ],
            [95     ,140    ,192    ,250    ,309    ],
        ]

        let index = fiXlvl(lvl)-1;
        return {
            攻击    :def[0][index],
            最大生命:def[1][index],
            防御    :def[2][index],
        }
    }
}
regDataTable(GenericEquip);