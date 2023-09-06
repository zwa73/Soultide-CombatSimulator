import { TBattleStartAfter, TRoundEndBefore, TRoundStartAfter, TriggerSort } from '.';
import { Character } from './Character';




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
    /**获取全部角色 */
    getAllChars(){
        return this.forward.concat(this.backward);
    }
    /**含有任何角色 */
    hasAnyCharacter():boolean{
        return this.forward.length>0 || this.backward.length>0;
    }
    /**含有角色 */
    hasCharacter(char:Character):boolean{
        if(this.forward.includes(char) ||
        this.backward.includes(char)) return true;
        return false;
    }
}
/**战场 */
export class Battlefield{
    teamMap:Record<TeamType,Formation> = {
        A:new Formation(),
        B:new Formation(),
    };
    roundCount:number=1;
    isStart:boolean=false;
    constructor(){}
    /**添加角色 */
    addCharacter(team:TeamType,pos:"forward"|"backward",...chars:Character[]){
        this.teamMap[team][pos].push(...chars);
    }


    /**触发 回合结束前 触发器 */
    roundEndBefore(){
        let endRoundT:Array<{
            char:Character,
            t:TRoundEndBefore
        }>=[];
        for(let key in this.teamMap){
            this.teamMap[key as TeamType].getAllChars()
                .forEach(char=> endRoundT
                    .push(...char.getRoundEndBeforeT()
                    .map(t=>{return {char,t}})
                ));
        }
        endRoundT.sort(TriggerSort)
            .forEach(item=>item.t.trigger(this.roundCount,item.char));
    }
    /**触发 回合开始后 触发器 */
    roundStartAfter(){
        let endRoundT:Array<{
            char:Character,
            t:TRoundStartAfter
        }>=[];
        for(let key in this.teamMap){
            this.teamMap[key as TeamType].getAllChars()
                .forEach(char=> endRoundT
                    .push(...char.getRoundStartAfterT()
                    .map(t=>{return {char,t}})
                ));
        }
        endRoundT.sort(TriggerSort)
            .forEach(item=>item.t.trigger(this.roundCount,item.char));
    }
    /**结束第x回合
     * @returns 回合数
     */
    endRound():number{
        //结束前
        this.roundEndBefore();

        //结算回合
        for(let key in this.teamMap)
            this.teamMap[key as TeamType].getAllChars().forEach(char=> char.endRound(this.roundCount));

        console.log("结束第",this.roundCount,"回合");
        console.log();
        return ++this.roundCount;
    }
    /**开始第x回合
     * @returns 回合数
     */
    startRound(){
        console.log("开始第",this.roundCount,"回合");

        //开始后
        this.roundStartAfter();
        return this.roundCount;
    }
    /**进行一回合 */
    round(func?:()=>void){
        if(!this.isStart) this.startBattle();
        this.startRound();

        if(func) func();

        this.endRound();
    }

    /**触发 战斗开始后 触发器 */
    battleStartAfter(){
        let endRoundT:Array<{
            char:Character,
            t:TBattleStartAfter
        }>=[];
        for(let key in this.teamMap){
            this.teamMap[key as TeamType].getAllChars()
                .forEach(char=> endRoundT
                    .push(...char.getBattleStartT()
                    .map(t=>{return {char,t}})
                ));
        }
        endRoundT.sort(TriggerSort)
            .forEach(item=>item.t.trigger(item.char));
    }
    /**战斗开始时 */
    startBattle(){
        console.log("战斗开始");
        //战斗开始后
        this.battleStartAfter();

        this.isStart=true;
    }
}
export const DefaultBattlefield = new Battlefield();
