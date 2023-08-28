import { deepClone } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield, DefaultBattlefield } from "./CombatSimulation";
import { Damage } from "./Damage";
import { Buff, BuffTable } from "./Modify";
import { Skill, SkillData } from "./Skill";
import { DefStaticStatus, DynmaicStatus, StaticStatus, StaticStatusKey, StaticStatusOption } from "./Status";




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
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff:Buff,stack:number=1,countdown:number=Infinity){
        this.buffTable.addBuff(buff,stack,countdown);
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
            isTiggerSkill:isTiggerSkill,
            dataTable:{}
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
    /**结算回合 */
    endRound(){
        this.buffTable.endRound();
        this.dynmaicStatus.当前怒气 += this.getStaticStatus("怒气回复");
        let maxEnergy = this.getStaticStatus("最大怒气");
        if(this.dynmaicStatus.当前怒气>maxEnergy) this.dynmaicStatus.当前怒气 = maxEnergy;
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
        return new Character(this.name,deepClone(this.staticStatus));
    }
}