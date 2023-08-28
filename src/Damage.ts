import { Character } from "./CombatSimulation";
import { ModTableSet, StackBuff, matchCons } from "./Modify";
import { SkillCategory, SkillData, SkillRange, SkillType } from "./Skill";
import { StaticStatusKey, StaticStatusOption } from "./Status";

//———————————————————— 伤害 ————————————————————//



/**伤害类型枚举 */
export const DamageTypeList = ["雷电","冰霜","火焰","魔法","物理",
    "电击","极寒","燃烧","暗蚀","流血","治疗","固定"] as const;
/**伤害类型 */
export type DamageType = `${typeof DamageTypeList[number]}`;
/**undefine值的伤害类型Record */
const DamageTypeUndefineRecord:Record<DamageType,undefined> = DamageTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {}) as any;

/**伤害包含关系表 */
export const DamageIncludeMap:Record<DamageType,DamageType[]>=
    Object.keys(DamageTypeUndefineRecord).reduce((acc, key) => ({ ...acc, [key]: [key] }), {}) as any;
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

/**伤害来源 */
export type DamageSource={
    /**角色来源 */
    char?:Character,
    /**技能来源 */
    skill?:SkillData,
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
    source:DamageSource;
    /**
     * @param source      伤害来源
     * @param factor      伤害系数
     * @param info        伤害类型
     * @param specEffects 特殊效果
     */
    constructor(source:DamageSource,factor:number,info:DamageInfo,...specEffects:SpecEffect[]){
        this.source=source;
        this.factor=factor;
        this.info=info;
        this.specEffects=specEffects;
    }
    /**计算攻击时应用的加值与倍率
     * @param target  受伤角色
     * @returns [ multModMap, addModMap ]
     */
    private calcOnDamageModify(target:Character):ModTableSet{
        //计算伤害约束的buff
        const defset:ModTableSet = {addModTable:{},multModTable:{}};
        const charTableSet   = this.source.char?  this.source.char.buffTable.getDamageConsModTable(false,this.info):defset;
        const skillTableSet  = this.source.skill? this.source.skill.buffTable.getDamageConsModTable(false,this.info):defset;
        const targetTableSet = target.buffTable.getDamageConsModTable(true,this.info);
        const modTableSet:ModTableSet ={multModTable:{},addModTable:{}} as any;
        function mergeMultMod(baseTable:StaticStatusOption,modTable:StaticStatusOption){
            for(let flag of Object.keys(modTable) as StaticStatusKey[]){
                if(baseTable[flag]==null) baseTable[flag]=1;
                baseTable[flag]!*=modTable[flag]!;
            }
        }
        function mergeAddMod(baseTable:StaticStatusOption,modTable:StaticStatusOption){
            for(let flag of Object.keys(modTable) as StaticStatusKey[]){
                if(baseTable[flag]==null) baseTable[flag]=0;
                baseTable[flag]!+=modTable[flag]!;
            }
        }
        function mergeTableSet(baseSet:ModTableSet,modSet:ModTableSet){
            mergeMultMod(baseSet.multModTable,modSet.multModTable);
            mergeAddMod (baseSet.addModTable ,modSet.addModTable );
        }
        mergeTableSet(modTableSet,charTableSet);
        mergeTableSet(modTableSet,targetTableSet);
        mergeTableSet(modTableSet,skillTableSet);
        return modTableSet;
    }
    /**对数值进行增益
     * @param base       基础值
     * @param flag       增益名
     * @param multModMap 倍率Map
     * @param addModMap  加值Map
     */
    private modValue(base:number,flag:StaticStatusKey,tableSet:ModTableSet){
        return (base+(this.source.char? this.source.char.getStaticStatus(flag):0)+(tableSet.addModTable[flag]||0))*(tableSet.multModTable[flag]||1);
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

        const modTableSet = this.calcOnDamageModify(target);
        console.log(modTableSet)
        //系数
        dmg=this.modValue(dmg,"伤害系数",modTableSet);

        //攻击
        let def = this.hasSpecEffect(穿防)||this.hasSpecEffect(治疗)? 0:target.getStaticStatus("防御");
        let atk = this.modValue(0,"攻击",modTableSet);
        dmg*=(atk-def)>1? (atk-def):1;

        //附加伤害
        let adddmg=this.modValue(0,`${dmgType}附伤`,modTableSet);

        //泛伤
        dmg   =this.modValue(dmg   ,`所有伤害`,modTableSet);
        adddmg=this.modValue(adddmg,`所有伤害`,modTableSet);
        //技伤
        dmg=this.modValue(dmg,`技能伤害`,modTableSet);

        //属性伤害
        for(let t of DamageIncludeMap[this.info.dmgType]){
            dmg   =this.modValue(dmg    ,`${t}伤害`,modTableSet);
            adddmg=this.modValue(adddmg ,`${t}伤害`,modTableSet);
        }

        //类别伤害
        dmg=this.modValue(dmg    ,`${skillCategory}伤害`,modTableSet);
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
