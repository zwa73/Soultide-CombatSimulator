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
