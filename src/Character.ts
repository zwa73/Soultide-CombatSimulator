import * as utils from "@zwa73/utils";
import { Writeable,JObject } from "@zwa73/utils";
import { Attack } from "./Attack";
import { Battlefield, DefaultBattlefield } from "./Battlefield";
import { Damage } from "./Damage";
import { Buff, BuffName, BuffTable, ModifyType, genBuffInfo, matchCons } from "./Modify";
import { Skill, SkillData, SkillDataOption, SkillName } from "./Skill";
import { DefStatus, DynmaicStatus, StatusOption } from "./Status";
import { AnyHook, HookTriggerMap, TCauseAttackAfter, TCauseAttackBefore, TCauseDamageAfter, TCauseDamageBefore, TCauseSkillDamageAfter, TCauseSkillDamageBefore, TDamageAfter, TDamageBefore, TRoundEndBefore, TTakeAttackAfter, TTakeAttackBefore, TriggerSort } from "./Trigger";
import { GlobalTiggerTable } from "./DataTable";


/**角色 */
export class Character {
    /**角色名称 */
    name:string;
    /**角色处在的战场 */
    battlefield:Battlefield=DefaultBattlefield;
    /**角色的当前属性 */
    dynmaicStatus:DynmaicStatus;
    /**所有的附加状态
     * @deprecated 这个成员仅供伤害攻击计算系统或内部调用
     * 对角色操作buff是应经过角色函数 用于触发触发器
     */
    _buffTable:BuffTable=new BuffTable(this);
    /**所有的技能 */
    private skillTable:Record<SkillName,Skill>={};
    /**额外数据表 */
    dataTable:JObject={};
    /**释放的技能表 用于存储不会立即结束的技能 */
    private castingSkillData:Record<string,SkillData>={};

    constructor(name:string,status:StatusOption){
        this.name=name;
        let staticStatus:StatusOption = Object.assign({},DefStatus,status);
        let baseBuff:Buff = {
            info: genBuffInfo((name+"基础属性")as BuffName,"其他效果"),
            addModify:staticStatus
        }
        //console.log(name,"staticStatus",staticStatus)
        this._buffTable.addBuff(baseBuff);

        this.dynmaicStatus = {
            当前生命:staticStatus.最大生命||0,
            当前怒气:staticStatus.初始怒气||0,
        }
        DefaultBattlefield.addCharacter("A","forward",this);
    }
    /**获取角色的基础属性 */
    getBaseStatus():Writeable<Buff>{
        return this._buffTable.getBuff((this.name+"基础属性") as BuffName)!;
    }
    /**获取某个计算完增益的属性 */
    private getStaticStatus(field:ModifyType,damage?:Damage){
        let mod = this._buffTable.modValue(0,field,damage);
        return mod;
    }



    //———————————————————— 技能 ————————————————————//
    /**释放某个技能
     * @param skill  技能
     * @param target 目标
     * @param isTiggerSkill 是触发技能
     */
    useSkill(skill:Skill,target:Character[],skillDataOpt?:SkillDataOption){
        let skillData:SkillData;
        const preSkill = this.getCastingSkill(skillDataOpt?.uid);

        //如果uid是释放中的技能 则视为继续释放
        if(preSkill){
            skillData=Object.assign({},preSkill,skillDataOpt);
        }else {
            skillData = {
                skill:skill,
                user:this,
                targetList:target,
                battlefield:this.battlefield,
                buffTable:new BuffTable(this),
                isTriggerSkill:false,
                uid:utils.genUUID()
            }
            skillData = Object.assign({},skillData,skillDataOpt);

            this.getTriggers("释放技能前").forEach(t=> skillData=t.trigger(skillData));

            console.log(this.name,"开始向",skillData.targetList.map(char=>char.name),"释放",skillData.skill.info.skillName);
            //消耗怒气
            if(!skillData.isTriggerSkill) this.dynmaicStatus.当前怒气-= skill.cost||0;
        }

        //产生效果
        if(skill.cast) skill.cast(skillData);
        //记录释放中
        this.castingSkillData[skillData.uid] = skillData;

        //结束技能
        if(skill.willNotEnd!==true) this.endSkill(skillData.uid);
    }
    /**获取某个释放中的技能 */
    getCastingSkill(uid:string|undefined):SkillData|undefined{
        if(uid==null) return undefined;
        return this.castingSkillData[uid];
    }
    /**结束某个技能 仅用于不会自动结束的技能
     * @param uid 技能的唯一ID
     */
    endSkill(uid:string){
        const skillData = this.castingSkillData[uid];
        const {targetList} = skillData;
        console.log(this.name,"结束了向",targetList.map(char=>char.name),"释放的",skillData.skill.info.skillName);
        this.getTriggers("释放技能后").forEach(t=> t.trigger(skillData));
        delete this.castingSkillData[uid];
    }
    /**被动的触发某个技能
     * @param skill  技能
     * @param target 目标
     */
    triggerSkill(skill:Skill,target:Character[],skillDataOpt?:SkillDataOption){
        const triggeropt:SkillDataOption={
            isTriggerSkill:true
        }
        let mergeOpt = Object.assign({},triggeropt,skillDataOpt);
        console.log(this.name,"触发了",skill.info.skillName);
        this.useSkill(skill,target,mergeOpt);
    }



    //———————————————————— 行动 ————————————————————//
    /**获取战斗开始后触发器 */
    getBattleStartT(){
        return this.getTriggers("战斗开始后");
    }
    /**获得回合结束前触发器 */
    getRoundEndBeforeT(){
        return this.getTriggers("回合结束前");
    }
    /**获得回合开始后触发器 */
    getRoundStartAfterT(){
        return this.getTriggers("回合开始后");
    }
    /**结算回合 */
    endRound(roundCount:number){
        this._buffTable.endRound();
        this.dynmaicStatus.当前怒气 += this.getStaticStatus("怒气回复");
        let maxEnergy = this.getStaticStatus("最大怒气");
        if(this.dynmaicStatus.当前怒气>maxEnergy) this.dynmaicStatus.当前怒气 = maxEnergy;
    }
    /**开始行动 */
    startTurn(){
        console.log(this.name,"开始行动");
        this.getTriggers("行动开始后").sort(TriggerSort)
            .forEach(t=>t.trigger(this));
    }
    /**结束行动 */
    endTurn(){
        this.getTriggers("行动结束前").sort(TriggerSort)
            .forEach(t=>t.trigger(this));
        console.log(this.name,"结束行动");
        console.log();
    }
    /**进行一次行动 */
    turn(func:(char:Character)=>void){
        this.startTurn();
        if(func) func(this);
        this.endTurn();
    }
    /**进行一次技能行动 */
    skillTurn(skill:Skill,target:Character[],opt?:SkillDataOption){
        this.turn(()=>this.useSkill(skill,target,opt))
    }



    //———————————————————— 伤害 ————————————————————//
    /**触发造成伤害前的触发器 */
    getHurtBefore(damage:Damage){
        //造成伤害前
        let causeDBeforeT:Array<TDamageBefore> = [];
        if(damage.source.char){
            let source = damage.source.char;
            causeDBeforeT.push(...source.getTriggers("造成伤害前"));
            causeDBeforeT.push(...source.getTriggers("造成技能伤害前"));
        }
        causeDBeforeT.push(...this.getTriggers("受到伤害前"));
        causeDBeforeT.push(...this.getTriggers("受到技能伤害前"));
        causeDBeforeT.sort(TriggerSort)
            .forEach(t=>{
                const category = damage.info.dmgCategory;
                if(!matchCons(damage,t.damageCons)) return;
                if(category=="所有伤害"){
                    if( (t.hook=="造成技能伤害前" && damage.isSkillDamage()) ||
                        (t.hook=="受到技能伤害前" && damage.isSkillDamage()) ||
                        (t.hook=="造成伤害前"   ) ||
                        (t.hook=="受到伤害前"   ) )
                        damage = t.trigger(damage,this);
                }
            });
    }
    /**触发造成伤害后的触发器 */
    getHurtAfter(damage:Damage){
        //造成伤害后
        let causeDAfterT:Array<TDamageAfter> = [];
        if(damage.source.char){
            let source = damage.source.char;
            causeDAfterT.push(...source.getTriggers("造成伤害后"));
            causeDAfterT.push(...source.getTriggers("造成技能伤害后"));
        }
        causeDAfterT.push(...this.getTriggers("受到伤害后"));
        causeDAfterT.push(...this.getTriggers("受到技能伤害后"));
        causeDAfterT.sort(TriggerSort)
            .forEach(t=>{
                const category = damage.info.dmgCategory;
                if(!matchCons(damage,t.damageCons)) return;
                if(category=="所有伤害"){
                    if( (t.hook=="造成技能伤害后" && damage.isSkillDamage()) ||
                        (t.hook=="受到技能伤害后" && damage.isSkillDamage()) ||
                        (t.hook=="造成伤害后"   ) ||
                        (t.hook=="受到伤害后"   ) )
                        t.trigger(damage,this);
                }
            });
    }
    /**受到伤害 */
    getHurt(damage:Damage){
        this.getHurtBefore(damage);

        //计算伤害
        let dmg = damage.calcOverdamage(this);
        this.dynmaicStatus.当前生命-=dmg;

        //log
        let log = `${this.name} 受到`;
        let hasSource = false;
        if(damage.source.char!=null){
            hasSource = true;
            log += ` ${damage.source.char.name}`
        }
        if(damage.source.skillData!=null){
            hasSource = true;
            log += ` ${damage.source.skillData.skill.info.skillName}`
        }
        if(hasSource)
            log+=" 造成的"
        if(damage.info.dmgCategory=="所有伤害")
            console.log(log,dmg,"点",damage.info.dmgType,`${damage.hasSpecEffect("暴击特效")? "暴击":""}`)
        else
            console.log(log,dmg,"点",damage.info.dmgCategory,`${damage.hasSpecEffect("暴击特效")? "暴击":""}`)

        this.getHurtAfter(damage);
    }



    //———————————————————— 攻击 ————————————————————//
    /**触发受到攻击前的触发器 */
    getHitBefore(attack:Attack){
        //攻击前
        let causeABeforeT:Array<TCauseAttackBefore|TTakeAttackBefore> = [];
        let source = attack.source.char;
        causeABeforeT.push(...source.getTriggers("造成攻击前"))
        causeABeforeT.push(...this.  getTriggers("受到攻击前"))
        causeABeforeT.sort(TriggerSort)
            .forEach(t=>{
                const category = attack.damage.info.dmgCategory;
                if( (t.hook=="造成攻击前" && category=="所有伤害") ||
                    (t.hook=="受到攻击前" && category=="所有伤害"))
                    attack = t.trigger(attack,this);
            })
    }
    /**触发受到攻击后的触发器 */
    getHitAfter(attack:Attack){
        //攻击后
        let causeAAfterT:Array<TCauseAttackAfter|TTakeAttackAfter> = [];
        let source = attack.source.char;
        causeAAfterT.push(...source.getTriggers("造成攻击后"));
        causeAAfterT.push(...this.  getTriggers("受到攻击后"));
        causeAAfterT.sort(TriggerSort)
            .forEach(t=>{
                const category = attack.damage.info.dmgCategory;
                if( (t.hook=="造成攻击后" && category=="所有伤害") ||
                    (t.hook=="受到攻击后" && category=="所有伤害"))
                    t.trigger(attack,this);
            });
    }
    /**受到攻击击中 */
    getHit(attack:Attack){
        this.getHitBefore(attack);

        let dmg = attack.calcDamage(this);
        this.getHurt(dmg);

        this.getHitAfter(attack);
    }



    //———————————————————— 其他 ————————————————————//
    /**克隆角色 */
    clone():Character{
        let nchar = new Character(this.name,{});
        nchar._buffTable = this._buffTable.clone();
        const {...skills} = this.skillTable;
        nchar.skillTable = {...skills};
        nchar.dataTable = utils.deepClone(this.dataTable);
        const {...status} = this.dynmaicStatus;
        nchar.dynmaicStatus = {...status};
        return nchar;
    }
    /**添加技能 同时加入技能的被动buff*/
    addSkill(skill:Skill){
        this.skillTable[skill.info.skillName] = skill;
        if(skill.passiveList==null) return;
        for(let stackpe of skill.passiveList)
            this.addBuff(stackpe.buff,stackpe.stack,stackpe.duration);
    }
    /**获取所有对应触发器 包括全局触发器 技能触发器 */
    private getTriggers<T extends AnyHook>(hook:T):HookTriggerMap[T][] {
        //索引触发器类型
        type TT = HookTriggerMap[T];
        //触发器数组
        const tiggers = this._buffTable.getTriggers(hook);
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
        tiggers.sort((a,b)=>TriggerSort(a,b));
        return tiggers;
    }



    //———————————————————— util ————————————————————//
    /**获取一个Buff的层数 并触发触发器 Get Buff Stack Count And Trigger*/
    getBuffStackCount(buff:Buff):number{
        let count = this._buffTable.getBuffStackCount(buff);
        this.getTriggers("获取效果层数后").forEach(t=> count = t.trigger(this,buff,count));
        return count;
    }
    /**添加一个buff 并触发触发器
     * @param buff      buff
     * @param stack     层数        默认1
     * @param duration  持续回合    默认无限
     */
    addBuff(buff:Buff,stack:number=1,duration:number=Infinity){
        let log = `获得了${stack==1?"":" "+stack+" 层"}${duration==Infinity? "":" "+duration+" 回合"}`
        console.log(this.name,log,buff.info.buffName);
        return this._buffTable.addBuff(buff,stack,duration);
    }
    /**移除某个buff 并触发触发器 */
    removeBuff(buff:Buff){
        return this._buffTable.removeBuff(buff);
    }
    /**含有某个Buff
     * @param buff      buff
     */
    hasBuff(buff:Buff){
        return this._buffTable.hasBuff(buff);
    }
}

/**角色生成器 */
export interface CharGener {
    /**角色生成器
     * @param name 角色名
     * @param stat 角色属性
     */
    (name?:string,stat?:StatusOption):Character;
}