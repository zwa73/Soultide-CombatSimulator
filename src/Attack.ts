import { Character } from "./Character";
import { Damage, 暴击 } from "./Damage";
import { BuffTable, DefModSet, addModSet, multModSet } from "./Modify";
import { SkillData } from "./Skill";


/**攻击来源 */
export type AttackSource={
    /**角色来源 */
    char?:Character,
    /**技能来源 */
    skill?:SkillData,
}


/**造成技能攻击 */
export class Attack{
    /**攻击的伤害 */
    private readonly damage:Damage;
    /**攻击来源 */
    readonly source:AttackSource;
    /**只应用于此次攻击的Buff */
    readonly buffTable:BuffTable = new BuffTable();
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source:AttackSource,damage:Damage){
        this.source=source;
        this.damage=damage;
        this.damage.source.attack = this;
    }
    /**计算一段攻击伤害 */
    calcDamage(target:Character):Damage{
        //暴击率
        const charCrit = this.source.char
            ? this.source.char.buffTable.getModSet("暴击率")
            :DefModSet;
        const skillCrit = this.source.skill
            ? this.source.skill.buffTable.getModSet("暴击率")
            :DefModSet;
        const targetCrit = target.buffTable.getModSet("暴击率",true);
        const critSet = multModSet(targetCrit,addModSet(charCrit,skillCrit));
        const critRate = critSet.add*critSet.mult;
        let currDamage = this.damage.clone();
        if(Math.random()<critRate)
            currDamage.specEffects.push(暴击);
        return currDamage;
    }
    /**复制攻击 */
    clone(){
        return new Attack(this.source,this.damage.clone());
    }
}