import * as utils from '@zwa73/utils';
import { JObject } from '@zwa73/utils';
import { AnyHook, AnyTigger, HookTiggerMap } from './Tigger';
import { Skill, SkillData } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { DamageInfoConstraintList, ModifyType, ModifyTypeList } from './OnDamageModify';
/**静态属性 */
export type StaticStatus={
    /**最大生命 */
    最大生命:number;
    /**攻击 */
    攻击:    number;
    /**速度 */
    速度:      number;
    /**防御 */
    防御:      number;
    /**暴击率 */
    暴击率:    number;
    /**暴击伤害 */
    暴击伤害:  number;
    /**初始怒气 */
    初始怒气:  number;
    /**闪避 */
    闪避:      number;
}&Record<ModifyType,number>;
/**默认的属性 */
export const DefStaticStatus:StaticStatus={
    最大生命    :0,
    攻击        :0,
    速度        :0,
    防御        :0,
    暴击率      :0.05,
    暴击伤害    :1.5,
    初始怒气    :0,
    闪避        :0,
} as StaticStatus;
ModifyTypeList.forEach(item=>DefStaticStatus[item]=0);
/**静态属性键 */
export type StaticStatusKey = keyof StaticStatus;


/**静态属性 选项*/
export type StaticStatusOption = Partial<StaticStatus>;

/**当前属性 */
export type DynmaicStatus={
    /**当前生命 */
    当前生命:number;
    /**当前怒气 */
    当前怒气:number;
}
/**附加状态 */
export type Buff={
    /**名称 */
    name:string;
    /**可叠加 */
    canSatck?:boolean;
    /**结束时间点 数字为经过回合数 hook字段为下一次hook触发时 默认则不结束*/
    endWith?:number|AnyHook;
    /**倍率增益 */
    multModify?:StaticStatusOption;
    /**叠加的倍率增益 */
    stackMultModify?:StaticStatusOption;
    /**数值增益 */
    addModify?:StaticStatusOption;
    /**叠加的数值增益 */
    stackAddModify?:StaticStatusOption;
    /**伤害约束 如果不为undefine 则只在造成伤害时参与计算*/
    damageConstraint?:DamageInfoConstraintList;
    /**触发器 */
    tiggerList?:AnyTigger[];
    /**内部参数表 */
    table?:JObject;
}
/**叠加的buff */
export type StackBuff={
    /**buff类型 */
    buff:Buff,
    /**叠加层数 */
    stack:number,
}
/**角色 */
export class Character {
    /**角色名称 */
    name:string;
    /**角色处在的战场 */
    battlefield:Battlefield=DefaultBattlefield;
    /**角色的静态属性 */
    staticStatus:StaticStatus;
    /**角色的当前属性 */
    dynmaicStatus:DynmaicStatus;
    /**所有的附加状态 */
    buffTable:Record<string,StackBuff>={};

    constructor(name:string,opt:StaticStatusOption){
        this.name=name;
        this.staticStatus = Object.assign({},DefStaticStatus,opt);
        this.dynmaicStatus = {
            当前生命:this.staticStatus.最大生命,
            当前怒气:this.staticStatus.初始怒气,
        }
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field:StaticStatusKey){
        let modify:number=1;
        for(let buffName in this.buffTable){
            let stackData = this.buffTable[buffName];
            let buff = stackData.buff;
            let stack = stackData.stack;

            if(buff.damageConstraint!=null) continue;

            if(buff.multModify)
                modify += buff.multModify[field]||0;
            if(buff.stackMultModify && stack)
                modify += stack * (buff.stackMultModify[field]||0);
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
    addBuff(buff:Buff,stack:number){
        if(this.buffTable[buff.name]==null || buff.canSatck!=true)
            this.buffTable[buff.name]={buff,stack};
        else{
            let cadd = this.buffTable[buff.name];
            cadd.stack+=stack;
        }
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
        this.getTiggers("释放技能前").forEach(t=> skillData=t.tigger(skillData));
        skill.use(skillData);
        this.getTiggers("释放技能后").forEach(t=> skillData=t.tigger(skillData));
    }
    /**受到伤害 */
    getHurt(damage:Damage){
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.当前生命-=dmg;
        console.log(this.name+" 受到",dmg,"点伤害")
    }
    /**受到攻击 */
    getHit(attack:Attack){
        let dmg = attack.calcDamage();
        this.getHurt(dmg);
    }
    /**克隆角色 */
    clone():Character{
        return new Character(this.name,utils.deepClone(this.staticStatus));
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
