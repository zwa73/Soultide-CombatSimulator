import { Character } from "./Character";
import { Damage, 暴击 } from "./Damage";

/**造成技能攻击 */
export class Attack{
    /**攻击的伤害 */
    private readonly damage:Damage;
    /**攻击来源 */
    readonly source:Character;
    /**
     * @param source 攻击来源
     * @param damage 攻击造成的伤害
     */
    constructor(source:Character,damage:Damage){
        this.source=source;
        this.damage=damage;
    }
    /**计算一段攻击伤害 */
    calcDamage():Damage{
        let critRate = this.source.getStaticStatus("暴击率");
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