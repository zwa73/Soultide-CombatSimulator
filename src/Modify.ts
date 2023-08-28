import { DamageInfo, DamageType, DamageTypeList } from "./Damage";
import { SkillCategory, SkillCategoryList, SkillRange, SkillType } from "./Skill";

//———————————————————— 调整值 ————————————————————//


/**加成类型 区分乘区 */
export type ModifyType = `${DamageType}伤害`|`${SkillCategory}伤害`|`${DamageType}附伤`|"技能伤害"|"暴击伤害"|"攻击"|"所有伤害"|"伤害系数";
/**所有可能的加成类型枚举 */
export const ModifyTypeList:ModifyType[]=[];
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}附伤`));
SkillCategoryList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
ModifyTypeList.push("技能伤害","暴击伤害","攻击","所有伤害","伤害系数");


/**伤害具体类型约束 */
export type DamageInfoConstraint=SkillType|SkillRange|SkillCategory|DamageType|"受攻击时";
/**伤害约束表 */
export type DamageInfoConstraintList=Array<DamageInfoConstraint>



/**判断 info 是否包含 target 的所有约束字段
 * @param isHurt 是受到攻击一方的buff 即匹配 "受攻击时" 约束
 * @param info   伤害信息
 * @param cons   约束列表
 */
export function matchCons(isHurt:boolean,info:DamageInfo,cons:DamageInfoConstraintList){
    let infos:DamageInfoConstraint[]=[
        info.skillCategory,info.skillRange,info.skillType,info.dmgType];
    if(isHurt) infos.push("受攻击时");
    //遍历约束
    for(let con of cons)
        if(!infos.includes(con)) return false;
    return true;
}