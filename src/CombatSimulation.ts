import * as utils from '@zwa73/utils';
import { AnyHook, HookTiggerMap } from './Tigger';
import { Skill, SkillData } from './Skill';
import { Damage } from './Damage';
import { Attack } from './Attack';
import { Buff, BuffTable } from './Modify';
import { DefStaticStatus, DynmaicStatus, StaticStatus, StaticStatusKey, StaticStatusOption } from './Status';


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
    buffTable:BuffTable=new BuffTable();

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
        let mod = this.buffTable.getStaticStatus(this.staticStatus[field],field);
        return mod;
    }
    /**添加一个buff */
    addBuff(buff:Buff,stack:number=1){
        this.buffTable.addBuff(buff,stack);
    }
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill:Skill,target:Character[],isTiggerSkill=false){
        let skillData:SkillData = {
            skill:skill,
            user:this,
            targetList:target,
            battlefield:this.battlefield,
            buffTable:new BuffTable(),
            isTiggerSkill:isTiggerSkill
        }
        skill.beforeCast? skill.beforeCast(skillData):undefined;
        this.buffTable.getTiggers("释放技能前").forEach(t=> skillData=t.tigger(skillData));
        skill.cast(skillData);
        this.buffTable.getTiggers("释放技能后").forEach(t=> skillData=t.tigger(skillData));
        skill.afterCast? skill.afterCast(skillData):undefined;
    }
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    tiggerSkill(skill:Skill,target:Character[]){
        this.useSkill(skill,target,true);
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
