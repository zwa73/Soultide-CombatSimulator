import { Attack, AttackSource } from "./Attack";
import { Writeable } from "@zwa73/utils";
import { Character } from "./Character";
import { DefModTableSet, ModSet, ModTableSet, ModifyType, addModTableSet } from "./Modify";
import { SkillInfo } from "./Skill";

//———————————————————— 伤害 ————————————————————//



/**伤害类型枚举 */
const DamageBaseTypeList = ["雷电","冰霜","火焰","魔法","物理",
    "电击","极寒","燃烧","暗蚀","流血","治疗","固定"] as const;

/**伤害类型 */
export type DamageType = `${typeof DamageBaseTypeList[number]}伤害`;
/**附伤类型 additional damage */
export type AddiDamageType = `${typeof DamageBaseTypeList[number]}附伤`;

/**伤害包含关系表 */
const DamageIncludeMap:Record<DamageType,DamageType[]>=
    DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [`${key}伤害`] }), {}) as any;
DamageIncludeMap.雷电伤害 = ["雷电伤害","电击伤害"];
DamageIncludeMap.冰霜伤害 = ["冰霜伤害","极寒伤害"];
DamageIncludeMap.火焰伤害 = ["火焰伤害","燃烧伤害"];
DamageIncludeMap.魔法伤害 = ["魔法伤害","暗蚀伤害"];
DamageIncludeMap.物理伤害 = ["物理伤害","流血伤害"];

/**附伤关系表 */
const AddiDamageIncludeMap:Record<DamageType,AddiDamageType>=
    DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [`${key}附伤`] }), {}) as any;

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
const DamageSpecMap:Record<DamageType,SpecEffect[]|undefined> =
    DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [key]: undefined }), {}) as any;;
DamageSpecMap.治疗伤害 = [治疗];
DamageSpecMap.固定伤害 = [固定,稳定,穿防];
DamageSpecMap.燃烧伤害 = [穿盾];

/**伤害类型详情 非技能来源时 skillType 为 非技能 其他undefine*/
export type DamageInfo={
    /**伤害类型 */
    dmgType:DamageType;
}&Omit<Partial<Writeable<SkillInfo>>,"skillType">&
Pick<Writeable<SkillInfo>,"skillType">;


/**伤害来源 */
export type DamageSource={
    /**攻击来源 */
    attack?:Attack,
}& Partial<AttackSource>;




/**伤害 */
export class Damage {
	/**伤害详细类型 */
	info: DamageInfo;
	/**系数 */
	factor: number;
	/**特效 */
	specEffects: SpecEffect[] = [];
	/**来源 */
	source: DamageSource;
	/**
	 * @param source      伤害来源
	 * @param factor      伤害系数
	 * @param info        伤害类型
	 * @param specEffects 特殊效果
	 */
	constructor(
		source: DamageSource,
		factor: number,
		info: DamageInfo,
		...specEffects: SpecEffect[]
	) {
		this.source = source;
		this.factor = factor;
		this.info = info;
		this.specEffects = specEffects;
	}
	/**计算攻击时 来源的 应用的加值与倍率
	 * @returns [ multModMap, addModMap ]
	 */
	private calcSourceModTableSet(): ModTableSet {
		//计算角色的buff
		const charTableSet = this.source.char
			? this.source.char.buffTable.getModTableSet(this.info)
			: DefModTableSet;
        //console.log("charTableSet",charTableSet)
		//计算技能的buff
		const skillTableSet = this.source.skillData
			? this.source.skillData.buffTable.getModTableSet(this.info)
			: DefModTableSet;
		//计算攻击的buff
        const attackTableSet = this.source.attack
			? this.source.attack.buffTable.getModTableSet(this.info)
			: DefModTableSet;
		//console.log("targetTableSet",targetTableSet)
        return addModTableSet(charTableSet,skillTableSet,attackTableSet);
	}

	/**对数值进行增益
	 * @param base       基础值
	 * @param flag       标签
	 * @param tableSet   来源的调整值
     * @param targetFlag 目标的标签
	 * @param tableSet   目标的调整值
	 */
	private modValue(base: number, flag: ModifyType, tableSet: ModTableSet, targetFlag:ModifyType, targetTableSet:ModTableSet) {
		return (
			(base + (tableSet.addModTable[flag] || 0) + (targetTableSet.addModTable[targetFlag] || 0)) *
			(tableSet.multModTable[flag] || 1) * (targetTableSet.multModTable[targetFlag] || 1)
		);
	}
	/**从一个table获取调整值
	 * @param base       基础值
	 * @param flag       标签
	 * @param tableSet   调整值
	 */
	private modValueSingle(base:number,flag:ModifyType,tableSet:ModTableSet):number{
		return (base + (tableSet.addModTable[flag]||0)) * (tableSet.multModTable[flag]||1);
	}
	/**含有某个特效 */
	hasSpecEffect(flag: SpecEffect) {
		return this.specEffects.includes(flag) || DamageSpecMap[this.info.dmgType]?.includes(flag);
	}
	/**计算伤害 */
	calcOverdamage(target: Character): number {
		const { dmgType, skillCategory, skillRange } = this.info;
		let dmg = this.factor;
        //console.log("基础系数",this.factor)
		if (this.hasSpecEffect(固定)) return dmg;

		const targetModTableSet = target.buffTable.getModTableSet(this.info);
		const sourceModTableSet = this.calcSourceModTableSet();
		//console.log(sourceModTableSet);
		//console.log(targetModTableSet);
		//系数
		dmg = this.modValue(dmg, "伤害系数", sourceModTableSet, "受到伤害系数", targetModTableSet);

		//防御
		let def = this.modValueSingle(0,"防御",targetModTableSet);
		def = this.hasSpecEffect(穿防) || this.hasSpecEffect(治疗)? 0:def;
		//穿防
		let pendef = this.modValue(0, "穿透防御", sourceModTableSet, "受到穿透防御", targetModTableSet);
		def = def*(1-pendef);
		//攻击
        let atk = this.modValue(0, "攻击", sourceModTableSet, "受到攻击", targetModTableSet);
		dmg *= atk - def > 1 ? atk - def : 1;

		//附加伤害
		let needAdd = this.isSkillDamage();
		let adddmg = 0;
		if (needAdd)
            adddmg = this.modValue(0, AddiDamageIncludeMap[dmgType], sourceModTableSet,
                `受到${AddiDamageIncludeMap[dmgType]}`, targetModTableSet);

		//泛伤
		dmg = this.modValue(dmg, "所有伤害", sourceModTableSet, "受到所有伤害", targetModTableSet);
		if (needAdd) adddmg = this.modValue(adddmg, "所有伤害", sourceModTableSet, "受到所有伤害", targetModTableSet);

		//技伤
		dmg = this.modValue(dmg, `技能伤害`, sourceModTableSet, "受到技能伤害", targetModTableSet);

		//属性伤害
		for (let t of DamageIncludeMap[this.info.dmgType]) {
			dmg = this.modValue(dmg, t, sourceModTableSet, `受到${t}`, targetModTableSet);
			if (needAdd) adddmg = this.modValue(adddmg, t, sourceModTableSet, `受到${t}`, targetModTableSet);
		}

		//类别伤害
		if(skillCategory!=undefined)
			dmg = this.modValue(dmg, `${skillCategory}伤害`, sourceModTableSet,
				`受到${skillCategory}伤害`, targetModTableSet);

		//范围类型伤害
		if(skillRange!=undefined)
			dmg = this.modValue(dmg, `${skillRange}伤害`, sourceModTableSet,
			`受到${skillRange}伤害`, targetModTableSet);

        //暴击伤害
        if(this.hasSpecEffect(暴击)){
            let critdmg = this.modValue(0, `暴击伤害`, sourceModTableSet,
                `受到暴击伤害`, targetModTableSet);
            dmg = dmg*critdmg;
        }

		//合并附伤
		dmg += adddmg;
		//浮动 +-5%
		if (!this.hasSpecEffect(稳定)) dmg = dmg - (dmg * 0.05) + (Math.random() * dmg * 0.1);
		return Math.floor(dmg);
	}
    /**是技能伤害 */
    isSkillDamage():boolean{
        return this.info.skillType != "非技能";
    }
	/**复制一份伤害 */
	clone() {
		return new Damage(this.source, this.factor, this.info, ...this.specEffects);
	}
}
