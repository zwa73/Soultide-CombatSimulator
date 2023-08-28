import { DamageInfo, DamageType, DamageTypeList } from "./Damage";
import { SkillCategory, SkillCategoryList, SkillRange, SkillType } from "./Skill";

/**加成类型 区分乘区*/
export type ModifyType = `${DamageType}伤害`|`${SkillCategory}伤害`|`${DamageType}附伤`|"技能伤害"|"暴击伤害"|"攻击"|"所有伤害"|"伤害系数";
export const ModifyTypeList:ModifyType[]=[];
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
DamageTypeList.forEach(item=>ModifyTypeList.push(`${item}附伤`));
SkillCategoryList.forEach(item=>ModifyTypeList.push(`${item}伤害`));
ModifyTypeList.push("技能伤害","暴击伤害","攻击","所有伤害","伤害系数");


/**伤害具体类型约束 */
export type DamageInfoConstraints=Array<SkillType|SkillRange|SkillCategory|DamageType>

/**判断target是否完全包含base */
export function testConstraints(base:DamageInfo,target:DamageInfoConstraints){
    for(let str of target){
        if( target.includes(base.skillCategory)||
            target.includes(base.skillRange)   ||
            target.includes(base.skillType)    ||
            target.includes(base.dmgType)
        ) continue;
        return false;
    }
    return true;
}