import { Character } from "./CombatSimulation";
import { ModifyType, testConstraints } from "./OnDamageModify";
import { SkillCategory, SkillType, SkillRange } from "./Skill";

/**伤害类型枚举 */
export const DamageTypeList = ["雷电","冰霜","火焰","魔法","物理",
    "电击","极寒","燃烧","暗蚀","流血","治疗","固定"] as const;
export type DamageType = `${typeof DamageTypeList[number]}`;
const DamageTypeUndefineRecord:Record<DamageType,undefined> = DamageTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {}) as any;

/**伤害包含关系表 */
export const DamageIncludeMap:Record<DamageType,DamageType[]|undefined>=DamageTypeUndefineRecord;
DamageIncludeMap.雷电 = ["雷电","电击"];
DamageIncludeMap.冰霜 = ["冰霜","极寒"];
DamageIncludeMap.火焰 = ["火焰","燃烧"];
DamageIncludeMap.魔法 = ["魔法","暗蚀"];
DamageIncludeMap.物理 = ["物理","流血"];


/**伤害特效 */
export enum SpecEffect{
    /**造成治疗 */
    治疗="治疗",
    /**不享受任何加成 造成相当于系数的伤害 */
    固定="固定",
    /**不会浮动 */
    稳定="稳定",
    /**穿透护盾 */
    穿盾="穿盾",
    /**忽视防御 */
    穿防="穿防",
    /**暴击伤害 */
    暴击="暴击",
};
export const {治疗,固定,稳定,穿盾,穿防,暴击}=SpecEffect;

/**伤害特殊效果表 */
export const DamageSpecMap:Record<DamageType,SpecEffect[]|undefined> = DamageTypeUndefineRecord;
DamageSpecMap.治疗 = [治疗];
DamageSpecMap.固定 = [固定,稳定,穿防];
DamageSpecMap.燃烧 = [穿盾];

/**伤害具体类型 */
export type DamageInfo={
    /**技能的类型 */
    skillType:SkillType;
    /**技能范围 */
    skillRange:SkillRange;
    /**技能类别 */
    skillCategory:SkillCategory;
    /**伤害类型 */
    dmgType:DamageType;
}

/**伤害 */
export class Damage{
    /**伤害详细类型 */
    info: DamageInfo;
    /**系数 */
    factor:number;
    /**特效 */
    specEffects:SpecEffect[]=[];
    /**来源 */
    source:Character;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param category    伤害类别
     * @param specEffects 特殊效果
     */
    constructor(source:Character,factor:number,info:DamageInfo,...specEffects:SpecEffect[]){
        this.source=source;
        this.factor=factor;
        this.info=info;
        this.specEffects=specEffects;
    }
    /**含有某个特效 */
    hasSpecEffect(flag:SpecEffect){
        return this.specEffects.includes(flag) || DamageSpecMap[this.info.dmgType]?.includes(flag);
    }
    /**计算伤害 */
    calcOverdamage(target:Character):number{
        let dmg = this.factor;
        if(this.hasSpecEffect(固定)) return dmg;

        //计算修正
        const sourceModlist = this.source.getOnDamageModify()
            .filter(item=>!item.mod.isHurtMod && testConstraints(this.info,item.mod.constraint));
        const targetModlist = target.getOnDamageModify()
            .filter(item=>  item.mod.isHurtMod && testConstraints(this.info,item.mod.constraint));
        const sourceMod:Record<ModifyType,number|undefined> = {} as any;
        const targetMod:Record<ModifyType,number|undefined> = {} as any;
        for(let item of sourceModlist){
            let flag = item.mod.modifyType;
            if(sourceMod[flag]==null) sourceMod[flag]=1;
            sourceMod[flag]!+=item.mod.number*item.stack;
        }
        for(let item of targetModlist){
            let flag = item.mod.modifyType;
            if(targetMod[flag]==null) targetMod[flag]=1;
            targetMod[flag]!+=item.mod.number*item.stack;
        }

        //系数
        dmg+=(sourceMod.伤害系数||0)+(targetMod.伤害系数||0);

        //攻击
        let def = this.hasSpecEffect(穿防)||this.hasSpecEffect(治疗)? 0:target.getStaticStatus("defense");
        let atk = this.source.getStaticStatus("attack")*(sourceMod.攻击力||1)*(targetMod.攻击力||1) - def;
        dmg*=atk>1? atk:1;

        //附加伤害
        let adddmg=(sourceMod[`${this.info.dmgType}附伤`]||0)+(sourceMod[`${this.info.dmgType}附伤`]||0);

        //泛伤
        dmg   *=(sourceMod.所有伤害||1)*(targetMod.所有伤害||1);
        adddmg*=(sourceMod.所有伤害||1)*(targetMod.所有伤害||1);

        //技伤
        dmg*=(sourceMod.技能伤害||1)*(targetMod.技能伤害||1);

        //属性伤害
        let tlist:DamageType[] = DamageIncludeMap[this.info.dmgType]||[this.info.dmgType];
        for(let t of tlist){
            let flag:ModifyType = `${t}伤害`;
            dmg   *=(sourceMod[flag]||1)*(sourceMod[flag]||1);
            adddmg*=(sourceMod[flag]||1)*(sourceMod[flag]||1);
        }

        //类别伤害
        for(let t of tlist)
            dmg*=(sourceMod[`${this.info.skillCategory}伤害`]||1)*(sourceMod[`${this.info.skillCategory}伤害`]||1);

        //浮动
        if(!this.hasSpecEffect(稳定))
            dmg = dmg+(Math.random()*dmg*0.1)-dmg*0.05;
        return dmg+adddmg;
    }
    /**复制一份伤害 */
    clone(){
        return new Damage(this.source,this.factor,this.info,...this.specEffects);
    }
}
