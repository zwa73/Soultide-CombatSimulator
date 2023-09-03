import { Character } from "./Character";
import { Damage, SpecEffect, genSkillDamage, DamageType, DamageCategory } from "./Damage";
import { BuffTable, ModSet } from "./Modify";
import { SkillData } from "./Skill";


/**攻击来源 */
export type AttackSource={
    /**角色来源 */
    char:Character,
    /**技能来源 */
    skillData:SkillData,
}


/**造成技能攻击 */
export class Attack{
    /**攻击的伤害 */
    readonly damage:Damage;
    /**攻击来源 */
    readonly source:AttackSource;
    /**只应用于此次攻击的Buff */
    readonly buffTable:BuffTable;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source:AttackSource,damage:Damage){
        this.buffTable = new BuffTable(source.char);
        this.source=source;
        this.damage=damage;
        this.damage.source.attack = this;
    }
    /**计算一段攻击伤害 */
    calcDamage(target:Character):Damage{
        //暴击率
        const charCrit = this.source.char._buffTable.getModSet("暴击率");
        const skillCrit = this.source.skillData.buffTable.getModSet("暴击率");
        const targetCrit = target._buffTable.getModSet("受到暴击率");
        const critSet = ModSet.multSet(targetCrit,ModSet.addSet(charCrit,skillCrit));
        const critRate = critSet.modValue(0);
        let currDamage = this.damage.clone();
        if(Math.random()<critRate)
            currDamage.specEffects.push("暴击特效");
        if(this.source.skillData.isTriggerSkill)
            currDamage.specEffects.push("鸣响特效");
        return currDamage;
    }
    /**复制攻击 */
    clone(){
        return new Attack(this.source,this.damage.clone());
    }
}



/**产生攻击 */
export function genAttack<DT extends DamageCategory>(
        skillData:SkillData,
        factor:number,
        dmgCategory:DT,
        dmgType?:(DT extends "所有伤害"? DamageType:undefined),
        ...specEffects:SpecEffect[]
    ):Attack{
    return new Attack({char:skillData.user,skillData:skillData},
        genSkillDamage(factor,dmgCategory,dmgType,skillData,...specEffects));
}