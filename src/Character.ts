import { deepClone } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield, DefaultBattlefield } from "./CombatSimulation";
import { Damage, DamageInfo } from "./Damage";
import { Buff, BuffTable } from "./Modify";
import { Skill, SkillData } from "./Skill";
import { DefStaticStatus, DynmaicStatus, StaticStatusKey, StaticStatusOption } from "./Status";


/**角色 */
export class Character {
    /**角色名称 */
    name:string;
    /**角色处在的战场 */
    battlefield:Battlefield=DefaultBattlefield;
    /**角色的当前属性 */
    dynmaicStatus:DynmaicStatus;
    /**所有的附加状态 */
    buffTable:BuffTable=new BuffTable();

    constructor(name:string,opt:StaticStatusOption){
        this.name=name;
        let staticStatus:StaticStatusOption = Object.assign({},DefStaticStatus,opt);
        let baseBuff:Buff = {
            name:name+"基础属性",
            addModify:staticStatus
        }
        //console.log(name,"staticStatus",staticStatus)
        this.addBuff(baseBuff);

        this.dynmaicStatus = {
            当前生命:staticStatus.最大生命||0,
            当前怒气:staticStatus.初始怒气||0,
        }
    }
    /**获取某个计算完增益的属性 */
    getStaticStatus(field:StaticStatusKey,isHurt?:boolean,damageInfo?:DamageInfo){
        let mod = this.buffTable.getStaticStatus(0,field,isHurt,damageInfo);
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
        let char = new Character(this.name,{});
        let bt = this.buffTable.clone();
        char.buffTable = bt;
        return char;
    }
}