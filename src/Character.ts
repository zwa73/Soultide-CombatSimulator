import * as utils from "@zwa73/utils";
import { Writeable } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield, DefaultBattlefield } from "./Battlefield";
import { Damage, DamageInfo, 暴击 } from "./Damage";
import { Buff, BuffName, BuffTable, ModifyType, genBuffInfo } from "./Modify";
import { Skill, SkillData, SkillName } from "./Skill";
import { DefStaticStatus, DynmaicStatus, StaticStatusOption } from "./Status";
import { AnyHook, HookTriggerMap } from "./Trigger";
import { GlobalTiggerTable, SkillTable } from "./DataTable";



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
    /**所有的技能 */
    skillTable:Record<SkillName,Skill>={};
    /**额外数据表 */
    dataTable:Record<string,any>={};

    constructor(name:string,status:StaticStatusOption){
        this.name=name;
        let staticStatus:StaticStatusOption = Object.assign({},DefStaticStatus,status);
        let baseBuff:Buff = {
            info: genBuffInfo((name+"基础属性")as BuffName,"其他效果"),
            addModify:staticStatus
        }
        //console.log(name,"staticStatus",staticStatus)
        this.addBuff(baseBuff);

        this.dynmaicStatus = {
            当前生命:staticStatus.最大生命||0,
            当前怒气:staticStatus.初始怒气||0,
        }
        DefaultBattlefield.addCharacter("A","forward",this);
    }
    /**获取角色的基础属性 */
    getBaseStatus():Writeable<Buff>{
        return this.buffTable.getBuff((this.name+"基础属性") as BuffName)!;
    }
    /**获取某个计算完增益的属性 */
    private getStaticStatus(field:ModifyType,damageInfo?:DamageInfo){
        let mod = this.buffTable.modValue(0,field,damageInfo);
        return mod;
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
            isTriggerSkill:isTiggerSkill,
            dataTable:{},
            uid:utils.genUUID()
        }

        console.log(this.name,"开始向",target.map(char=>char.name),"释放",skillData.skill.info.skillName);


        skill.beforeCast? skill.beforeCast(skillData):undefined;
        this.getTiggers("释放技能前").forEach(t=> skillData=t.trigger(skillData));
        //消耗怒气
        if(!isTiggerSkill) this.dynmaicStatus.当前怒气-= skill.cost||0;
        //产生效果
        if(skill.cast) skill.cast(skillData);
        this.getTiggers("释放技能后").forEach(t=> skillData=t.trigger(skillData));
        skill.afterCast? skill.afterCast(skillData):undefined;
    }
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    tiggerSkill(skill:Skill,target:Character[]){
        console.log(this.name,"触发了",skill.info.skillName);
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
        damage.source.char?.buffTable.getTiggers("造成伤害前")
            .forEach(t=> damage=t.trigger(damage,this));

        let isSkillDamage = damage.isSkillDamage();
        if(isSkillDamage)
            damage.source.char?.buffTable.getTiggers("造成技能伤害前")
                .forEach(t=> damage=t.trigger(damage,this));

        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.当前生命-=dmg;

        damage.source.char?.buffTable.getTiggers("造成伤害后")
            .forEach(t=> damage=t.trigger(damage,this));

        if(isSkillDamage)
            damage.source.char?.buffTable.getTiggers("造成技能伤害后")
                .forEach(t=> damage=t.trigger(damage,this));



        //log
        let log = `${this.name} 受到`;
        let hasSource = false;
        if(damage.source.char!=null){
            hasSource = true;
            log += ` ${damage.source.char.name}`
        }
        if(damage.source.skill!=null){
            hasSource = true;
            log += ` ${damage.source.skill.skill.info.skillName}`
        }
        if(hasSource)
            log+=" 造成的"

        console.log(log,dmg,"点",damage.info.dmgType,`${damage.hasSpecEffect(暴击)? "暴击":""}`)
    }
    /**受到攻击 */
    getHit(attack:Attack){
        let dmg = attack.calcDamage(this);
        this.getHurt(dmg);
    }
    /**克隆角色 */
    clone():Character{
        let char = new Character(this.name,{});
        let bt = this.buffTable.clone();
        char.buffTable = bt;
        return char;
    }
    /**添加技能 同时加入技能的被动buff*/
    addSkill(skill:Skill){
        this.skillTable[skill.info.skillName] = skill;
        if(skill.passiveList==null) return;
        for(let stackpe of skill.passiveList)
            this.addBuff(stackpe.buff,stackpe.stack,stackpe.duration);
    }
    /**获取所有对应触发器 包括全局触发器 技能触发器 */
    private getTiggers<T extends AnyHook>(hook:T):HookTriggerMap[T][] {
        //索引触发器类型
        type TT = HookTriggerMap[T];
        //触发器数组
        const tiggers = this.buffTable.getTiggers(hook);
        //全局触发器
        for (const key in GlobalTiggerTable){
            let tigger = GlobalTiggerTable[key as BuffName];
            if(tigger.hook==hook)
                tiggers.push(tigger as TT);
        }
        //技能触发器
        for (const skillName in this.skillTable){
            let skill = this.skillTable[skillName as SkillName];
            if(skill.triggerList==null) continue;
            for(let tigger of skill.triggerList){
                if(tigger.hook==hook)
                    tiggers.push(tigger as TT);
            }
        }
        tiggers.sort((a, b) => (b.weight||0) - (a.weight||0));
        return tiggers;
    }



    //———————————————————— util ————————————————————//
    /**获取一个Buff的层数
     * @deprecated 这个函数不会触发"获取状态层数"触发器
     */
    getBuffStackCountWithoutT(buff:Buff){
        return this.buffTable.getBuffStackCountWithoutT(buff);
    }
    /**获取一个Buff的层数 并触发触发器*/
    getBuffStackCountAndT(buff:Buff):number{
        let count = this.getBuffStackCountWithoutT(buff);
        this.getTiggers("获取效果层数后").forEach(t=> count = t.trigger(this,buff,count));
        return count;
    }
    /**添加一个buff
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff:Buff,stack:number=1,duration:number=Infinity){
        return this.buffTable.addBuff(buff,stack,duration);
    }
}

/**角色生成器 */
export interface CharGener {
    /**角色生成器
     * @param name 角色名
     * @param stat 角色属性
     */
    (name?:string,stat?:StaticStatusOption):Character;
}