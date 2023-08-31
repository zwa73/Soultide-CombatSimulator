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
    constructor(){}
    /**添加角色 */
    addCharacter(team:TeamType,pos:"forward"|"backward",...chars:Character[]){
        this.teamMap[team][pos].push(...chars);
    }
    /**经过一回合
     * @returns 回合数
     */
    endRound():number{
        for(let key in this.teamMap){
            this.teamMap[key as TeamType].getAllChars().forEach(char=> char.endRound());
        }
        console.log("开始第",++this.roundCount,"回合");
        return this.roundCount;
    }
}
export const DefaultBattlefield = new Battlefield();
