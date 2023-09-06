/**验证并修正蕴灵星级 */
export declare function fiXlvl(lvl: number | undefined): number;
export declare namespace GenericEquip {
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 攻击蕴灵属性Gen(lvl?: number): {
        攻击: number;
        最大生命: number;
        防御: number;
    };
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 防御蕴灵属性Gen(lvl?: number): {
        攻击: number;
        最大生命: number;
        防御: number;
    };
    /**生成满级 lvl 星 的蕴灵基础属性
     * @param lvl 蕴灵星级
     */
    function 辅助蕴灵属性Gen(lvl?: number): {
        攻击: number;
        最大生命: number;
        防御: number;
    };
}
