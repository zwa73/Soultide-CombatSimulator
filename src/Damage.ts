import { Attack, AttackSource } from "./Attack";
import { Writeable } from "@zwa73/utils";
import { Character } from "./Character";
import { ModSet, ModSetTable, ModifyType } from "./Modify";
import { SkillData, SkillInfo } from "./Skill";

//———————————————————— 伤害 ————————————————————//



/**伤害类型枚举 */
const DamageBaseTypeList = ["雷电","冰霜","火焰","魔法","物理",
    "电击","极寒","燃烧","暗蚀","流血","治疗","固定"] as const;

/**伤害类型 */
export type DamageType = `${typeof DamageBaseTypeList[number]}伤害`;
/**附伤类型 additional damage */
export type AddiDamageType = `${typeof DamageBaseTypeList[number]}附伤`;

/**子伤害依赖表 key可以由value[number] 增加 */
const SubDamageRelyMap:Record<DamageType,DamageType[]>=
    DamageBaseTypeList.reduce((acc, key) => ({ ...acc, [`${key}伤害`]: [] }), {}) as any;
SubDamageRelyMap.电击伤害 = ["雷电伤害"];
SubDamageRelyMap.极寒伤害 = ["冰霜伤害"];
SubDamageRelyMap.燃烧伤害 = ["火焰伤害"];
SubDamageRelyMap.暗蚀伤害 = ["魔法伤害"];
SubDamageRelyMap.流血伤害 = ["物理伤害"];

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
	private calcSourceModSetTable(): ModSetTable {
		//计算角色的buff
		const charSetTable = this.source.char
			? this.source.char.buffTable.getModSetTable(this)
			: new ModSetTable();
        //console.log("charSetTable",charSetTable)
		//计算技能的buff
		const skillSetTable = this.source.skillData
			? this.source.skillData.buffTable.getModSetTable(this)
			: new ModSetTable();
		//计算攻击的buff
        const attackSetTable = this.source.attack
			? this.source.attack.buffTable.getModSetTable(this)
			: new ModSetTable();
		//console.log("targetSetTable",targetSetTable)
        return ModSetTable.addSet(charSetTable,skillSetTable,attackSetTable);
	}

	/**含有某个特效 */
	hasSpecEffect(flag: SpecEffect) {
		return this.specEffects.includes(flag) || DamageSpecMap[this.info.dmgType]?.includes(flag);
	}
	/**计算伤害 */
	calcOverdamage(target: Character): number {
		const { dmgType, skillCategory, skillRange } = this.info;
		//需要附伤
		const needAdd = this.isSkillDamage();
		//基础系数
		let dmg = this.factor;
        //console.log("基础系数",this.factor)
		if (this.hasSpecEffect(固定)) return dmg;

		const targetModTable = target.buffTable.getModSetTable(this);
		const sourceModTable = this.calcSourceModSetTable();
		//console.log(sourceModSetTable);
		//console.log(targetModSetTable);

		/**对数值进行增益  目标Set与来源Set加算
		 * @param base       		基础值
		 * @param flag       		标签
    	 * @param targetFlag 		目标的标签
		 */
		function modValue(base: number, flag: ModifyType, targetFlag:ModifyType) {
			return ModSet.addSet(sourceModTable.getModSet(flag),targetModTable.getModSet(targetFlag)).modValue(base);
		}

		//系数
		dmg = modValue(dmg, "伤害系数", "受到伤害系数");

		//防御
		let def = targetModTable.getModSet("防御").modValue(0);
		def = this.hasSpecEffect(穿防) || this.hasSpecEffect(治疗)? 0:def;
		//穿防
		let pendef = ModSet.addSet(targetModTable.getModSet("受到穿透防御"),
			sourceModTable.getModSet("穿透防御"));
		def = (def-pendef.add)-(def*(pendef.mult-1));
		//攻击
        let atk = modValue(0, "攻击", "受到攻击");
		dmg *= atk - def > 1 ? atk - def : 1;

		//附加伤害
		let adddmg = 0;
		if (needAdd)
            adddmg = modValue(0, AddiDamageIncludeMap[dmgType],
                `受到${AddiDamageIncludeMap[dmgType]}`);

		//泛伤和属性伤害 乘区
		let baseDmgMod = ModSet.addSet(
			sourceModTable.getModSet("所有伤害"),
			targetModTable.getModSet("受到所有伤害"),
			sourceModTable.getModSet(dmgType),
			targetModTable.getModSet(`受到${dmgType}`));
		dmg = baseDmgMod.modValue(dmg);
		if (needAdd) adddmg = baseDmgMod.modValue(adddmg);

		//下级伤害 乘区
		for (let t of SubDamageRelyMap[dmgType]) {
			dmg = modValue(dmg, t, `受到${t}`);
			if (needAdd) adddmg = modValue(adddmg, t, `受到${t}`);
		}

		//技伤和技能类别伤害 乘区
		let skillDmgMod = ModSet.addSet(
			sourceModTable.getModSet(`技能伤害`),
			targetModTable.getModSet(`受到技能伤害`));
		if(skillCategory!=undefined)
			skillDmgMod.addSet(
				sourceModTable.getModSet(`${skillCategory}伤害`),
				targetModTable.getModSet(`受到${skillCategory}伤害`));
		dmg = skillDmgMod.modValue(dmg);
		if (needAdd) adddmg = skillDmgMod.modValue(adddmg);

		//范围类型伤害
		if(skillRange!=undefined){
			dmg = modValue(dmg, `${skillRange}伤害`,`受到${skillRange}伤害`);
			if (needAdd) adddmg = modValue(adddmg, `${skillRange}伤害`,`受到${skillRange}伤害`);
		}

        //暴击伤害
        if(this.hasSpecEffect(暴击)){
            let critdmg = modValue(0, `暴击伤害`,`受到暴击伤害`);
            dmg = dmg*critdmg;
			if (needAdd) adddmg = adddmg*critdmg
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



/**生成伤害信息 */
export function genDamageInfo(dmgType:DamageType,info?:SkillInfo):DamageInfo{
    return {
        skillName:info? info.skillName:undefined,
        skillCategory:info? info.skillCategory:undefined,
        skillRange:info? info.skillRange:undefined,
        skillType:info? info.skillType:"非技能",
        skillSubtype:info? info.skillSubtype:undefined,
        dmgType:dmgType,
    }
}
/**产生非技能伤害 */
export function genNonSkillDamage(factor:number,dmgType:DamageType,char?:Character,...specEffects:SpecEffect[]):Damage{
    return new Damage({char:char},factor,genDamageInfo(dmgType),...specEffects);
}
/**产生技能伤害 */
export function genSkillDamage(factor:number,dmgType:DamageType,skillData?:SkillData,...specEffects:SpecEffect[]):Damage{
    return new Damage({
        char:skillData?.user,
        skillData:skillData
    },factor,genDamageInfo(dmgType,skillData?.skill.info),...specEffects);
}