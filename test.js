const { Souls, Monsters, GenericBuff, DefaultBattlefield, BuffTable, Equips } = require("./index");

let aurora = Souls.Aurora.AuroraGen("Aurora",{
    初始怒气:72,
    最大怒气:120,
    攻击:6088,
});
aurora.addBuff(Equips.女武神.女武神Gen(5))
let andrea = Souls.Andrea.AndreaGen("Andrea",{});
andrea.addSkill(Souls.Silenus.能流感知);
let 稻草人 = Monsters.稻草人.稻草人Gen();



DefaultBattlefield.round(()=>{
    稻草人.addBuff(GenericBuff.极寒,10);
});
DefaultBattlefield.round();
DefaultBattlefield.round();
DefaultBattlefield.round();
DefaultBattlefield.round(()=>{
    aurora.skillTurn(Souls.Aurora.荆雷奔袭,[稻草人]);
});

//andrea.useSkill(Souls.Silenus.星尘余烬, [稻草人]);
//andrea.useSkill(Souls.Silenus.寂灭昭示, [稻草人]);
//for(let i=0;i<20;i++){
//    稻草人.useSkill(Souls.Colcher.王女的祝福, [andrea]);
//    andrea.useSkill(Souls.Andrea.极寒狙击, [稻草人]);
//    console.log("寒霜",稻草人.getBuffStackCount(Souls.Andrea.寒霜))
//}
DefaultBattlefield.round(()=>{
    稻草人.skillTurn(Souls.Colcher.王女的祝福, [aurora]);
    aurora.skillTurn(Souls.Aurora.失心童话,[稻草人]);
});

console.log(aurora.getBuffStackCount(Souls.Aurora.噩廻))
//console.log(char.buffTable._table)
//console.log(char.dynmaicStatus)
console.log(稻草人.dynmaicStatus)

//console.log(BuffTable)