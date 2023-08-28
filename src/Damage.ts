import { Character, StackBuff, StaticStatus, StaticStatusKey } from "./CombatSimulation";
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


function calcOnDamageModify(multMod:Record<StaticStatusKey,number|undefined>,
    addMod:Record<StaticStatusKey,number|undefined>,buffList:StackBuff[]){
    for(let item of buffList){
        let basedMultTable = item.buff.multModify||{};
        let stackMultTable = item.buff.stackMultModify||{};
        let basedAddTable  = item.buff.addModify||{};
        let stackAddTable  = item.buff.stackAddModify||{};
        let stack = item.stack;
        for(let flag of Object.keys(basedMultTable) as StaticStatusKey[]){
            if(multMod[flag]==null) multMod[flag]=1;
            multMod[flag]!+=basedMultTable[flag]!;
        }
        for(let flag of Object.keys(stackMultTable) as StaticStatusKey[]){
            if(multMod[flag]==null) multMod[flag]=1;
            multMod[flag]!+=stackMultTable[flag]!*stack;
        }
        for(let flag of Object.keys(basedAddTable) as StaticStatusKey[]){
            if(addMod[flag]==null) addMod[flag]=0;
            addMod[flag]!+=basedAddTable[flag]!;
        }
        for(let flag of Object.keys(stackAddTable) as StaticStatusKey[]){
            if(addMod[flag]==null) addMod[flag]=0;
            addMod[flag]!+=stackAddTable[flag]!*stack;
        }
    }
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
        const {dmgType,skillCategory} = this.info;
        let dmg = this.factor;
        if(this.hasSpecEffect(固定)) return dmg;

        //计算伤害约束的buff
        const sourceBuffList = Object.values(this.source.buffTable)
            .filter(item=>
                !item.buff.isHurtMod && item.buff.damageConstraint &&
                testConstraints(this.info,item.buff.damageConstraint));
        const targetMultList = Object.values(target.buffTable)
            .filter(item=>
                item.buff.isHurtMod && item.buff.damageConstraint &&
                testConstraints(this.info,item.buff.damageConstraint));
        const sourceMultMod:Record<StaticStatusKey,number|undefined> = {} as any;
        const sourceAddMod:Record<StaticStatusKey,number|undefined> = {} as any;
        const targetMultMod:Record<StaticStatusKey,number|undefined> = {} as any;
        const targetAddMod:Record<StaticStatusKey,number|undefined> = {} as any;
        calcOnDamageModify(sourceMultMod,sourceAddMod,sourceBuffList);
        calcOnDamageModify(targetMultMod,targetAddMod,targetMultList);
        //系数
        dmg=(dmg+(sourceAddMod.伤害系数||0)+(targetAddMod.伤害系数||0))*
            (sourceMultMod.伤害系数||1)*(targetMultMod.伤害系数||1);

        //攻击
        let def = this.hasSpecEffect(穿防)||this.hasSpecEffect(治疗)? 0:target.getStaticStatus("防御");
        let atk = (this.source.getStaticStatus("攻击")+(sourceAddMod.攻击||0)+(targetAddMod.攻击||0))*
            (sourceMultMod.攻击||1)*(targetMultMod.攻击||1) - def;
        dmg*=atk>1? atk:1;

        //附加伤害
        let adddmg=((sourceAddMod[`${dmgType}附伤`]||0)+(targetAddMod[`${dmgType}附伤`]||0))*
            (targetMultMod[`${dmgType}附伤`]||1)*(targetMultMod[`${dmgType}附伤`]||1);

        //泛伤
        dmg   =(dmg+(sourceAddMod.所有伤害||0)+(targetAddMod.所有伤害||0))*
            (sourceMultMod.所有伤害||1)*(targetMultMod.所有伤害||1);
        adddmg=(adddmg+(sourceAddMod.所有伤害||0)+(targetAddMod.所有伤害||0))*
            (sourceMultMod.所有伤害||1)*(targetMultMod.所有伤害||1);

        //技伤
        dmg=(dmg+(sourceAddMod.技能伤害||0)+(targetAddMod.技能伤害||0))*
            (sourceMultMod.技能伤害||1)*(targetMultMod.技能伤害||1);

        //属性伤害
        let tlist:DamageType[] = DamageIncludeMap[this.info.dmgType]||[this.info.dmgType];
        for(let t of tlist){
            let flag:ModifyType = `${t}伤害`;
            dmg   =(dmg+(sourceAddMod[flag]||0)+(targetAddMod[flag]||0))
                *(sourceMultMod[flag]||1)*(targetMultMod[flag]||1);
            adddmg=(adddmg+(sourceAddMod[flag]||0)+(targetAddMod[flag]||0))
                *(sourceMultMod[flag]||1)*(targetMultMod[flag]||1);
        }

        //类别伤害
        dmg=(dmg+(sourceAddMod[`${skillCategory}伤害`]||0)+(targetAddMod[`${skillCategory}伤害`]||0))*
            (sourceMultMod[`${skillCategory}伤害`]||1)*(targetMultMod[`${skillCategory}伤害`]||1);

        //合并附伤
        dmg+=adddmg;
        //浮动
        if(!this.hasSpecEffect(稳定))
            dmg = dmg+(Math.random()*dmg*0.1)-dmg*0.05;
        return Math.floor(dmg);
    }
    /**复制一份伤害 */
    clone(){
        return new Damage(this.source,this.factor,this.info,...this.specEffects);
    }
}
