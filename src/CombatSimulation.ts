import * as utils from '@zwa73/utils';
import { AnyHook, AnyTigger, HookTiggerMap } from './Tigger';
import { Skill, SkillData } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { OnDamageModify } from './OnDamageModify';
/**静态属性 */
export type StaticStatus={
    /**最大生命值 */
    maxHealth:  number;
    /**攻击力 */
    attack:     number;
    /**速度 */
    speed:      number;
    /**防御力 */
    defense:    number;
    /**暴击率 */
    critRate:   number;
    /**暴击伤害 */
    critDamage: number;
    /**初始怒气 */
    startEnergy:number;
    /**闪避 */
    dodge:      number;
}
/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;

/**当前属性 */
export type DynmaicStatus={
    /**当前生命 */
    health:number;
    /**当前怒气 */
    energy:number;
}
/**附加状态 */
export type Buff={
    /**名称 */
    name:string;
    /**可叠加 */
    canSatck?:boolean;
    /**层数 */
    stackCount?:number;
    /**面板倍率增益 */
    statusMultModify?:StaticStatusOption;
    /**叠加的面板倍率增益 */
    stackStatausMultModify?:StaticStatusOption;
    /**伤害时的增益 */
    modifyOnDamages?:OnDamageModify[];
    /**叠加的伤害时的增益 */
    stackModifyOnDamages?:OnDamageModify[];
    /**触发器 */
    tiggerList?:AnyTigger[];
}
/**角色 */
export class Character {
    /**角色处在的战场 */
    battlefield:Battlefield=DefaultBattlefield;
    /**角色的静态属性 */
    staticStatus:StaticStatus;
    /**角色的当前属性 */
    dynmaicStatus:DynmaicStatus;
    /**所有的附加状态 */
    buffTable:Record<string,{
        stackCount:number,
        buff:Buff
    }>={};

    constructor({maxHealth=1,attack=0,speed=0,defense=0,
        critRate=0.05,critDamage=1.5,startEnergy=0,dodge=0
    }:StaticStatusOption){
        this.staticStatus = {maxHealth,attack,speed,defense,
            critRate,critDamage,startEnergy,dodge};
        this.dynmaicStatus = {
            health:maxHealth,
            energy:startEnergy,
        }
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field:keyof StaticStatus){
        let modify:number=1;
        for(let key in this.buffTable){
            let stackData = this.buffTable[key];
            let buff = stackData.buff;
            if(buff.statusMultModify)
                modify += buff.statusMultModify[field]||0;
            if(buff.stackStatausMultModify && stackData.stackCount)
                modify += stackData.stackCount * (buff.stackStatausMultModify[field]||0);
        }
        return this.staticStatus[field]*modify;
    }
    /**获取所有对应触发器 */
    getTiggers<T extends AnyHook>(hook:T):HookTiggerMap[T][] {
        //索引触发器类型
        type TT = HookTiggerMap[T];
        //触发器数组
        let arr:TT[]=[];
        for (const obj of Object.values(this.buffTable)){
            if(obj.buff.tiggerList==null) continue;
            for(const tigger of obj.buff.tiggerList){
                if(tigger.hook==hook)
                    arr.push(tigger as TT);
            }
        }
        arr.sort((a, b) => (b.weight||0) - (a.weight||0));
        return arr;
    }
    addBuff(buff:Buff,stackCount:number){
        if(this.buffTable[buff.name]==null || buff.canSatck!=true)
            this.buffTable[buff.name]={buff,stackCount};
        else{
            let cadd = this.buffTable[buff.name];
            cadd.stackCount+=stackCount;
        }
    }
    /**获取所有伤害时生效的增益 */
    getOnDamageModify(){
        let list:{
            /**增益 */
            mod:OnDamageModify,
            /**叠加数 */
            stack:number,
        }[] = [];
        for(let key in this.buffTable){
            let stackData = this.buffTable[key];
            let buff = stackData.buff;
            if(buff.modifyOnDamages!=null){
                buff.modifyOnDamages.forEach(item=>list.push({
                    mod:item,
                    stack:1,
                }));
            }
            if(buff.stackModifyOnDamages!=null && stackData.stackCount!=null){
                let num = stackData.stackCount;
                buff.stackModifyOnDamages.forEach(item=>list.push({
                    mod:item,
                    stack:num,
                }));
            }
        }
        return list;
    }
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     */
    useSkill(skill:Skill,target:Character[]){
        let skillData:SkillData = {
            user:this,
            target:target,
            battlefield:this.battlefield,
        }
        this.getTiggers("UseSkillAfter").forEach(t=> skillData=t.tigger(skillData));
        skill.use(skillData);
        this.getTiggers("UseSkillBefore").forEach(t=> skillData=t.tigger(skillData));
    }
    /**受到伤害 */
    getHurt(damage:Damage){
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.health-=dmg;
        console.log(dmg)
    }
    /**受到攻击 */
    getHit(attack:Attack){
        let dmg = attack.calcDamage();
        this.getHurt(dmg);
    }
    /**克隆角色 */
    clone():Character{
        return new Character(utils.deepClone(this.staticStatus));
    }
}

/**队伍类型 */
export type TeamType="A"|"B";
/**队形 */
export class Formation{
    /**前排 */
    forward:Character[]=[];
    /**后排 */
    backward:Character[]=[];
    constructor(){};
    /**获取前排 */
    getForward(){
        if(this.forward.length>0) return this.forward;
        return this.backward;
    }
    /**获取后排 */
    getBackward(){
        if(this.backward.length>0) return this.backward;
        return this.forward;
    }
    /**含有角色 */
    hasCharacter():boolean{
        return this.forward.length>0 || this.backward.length>0;
    }
}
/**战场 */
export class Battlefield{
    teamMap:Record<TeamType,Formation> = {
        A:new Formation(),
        B:new Formation(),
    };
    roundCount:number=0;
    constructor(){}
    /**添加角色 */
    addCharacter(team:TeamType,pos:"forward"|"backward",...chars:Character[]){
        this.teamMap[team][pos].push(...chars);
    }
    /**经过一回合 */
    nextRound():number{return ++this.roundCount}
}
export const DefaultBattlefield = new Battlefield();
