const { Souls, Monsters, GenericBuff, DefaultBattlefield, BuffTable } = require("./index");

let aurora = Souls.Aurora.genChar("Aurora",{
    初始怒气:72,
    最大怒气:120,
    攻击:6088,
});
let andrea = Souls.Andrea.genChar("Andrea",{});
andrea.addSkill(Souls.Silenus.能流感知);
let 稻草人 = Monsters.稻草人.genChar();

稻草人.addBuff(GenericBuff.极寒,10);
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();

andrea.useSkill(Souls.Silenus.星尘余烬, [稻草人]);
andrea.useSkill(Souls.Silenus.寂灭昭示, [稻草人]);
for(let i=0;i<20;i++){
    稻草人.useSkill(Souls.Colcher.王女的祝福, [andrea]);
    andrea.useSkill(Souls.Andrea.极寒狙击, [稻草人]);
    console.log("寒霜",稻草人.getBuffStackCountAndT(Souls.Andrea.寒霜))
}
//char.useSkill(Souls.Aurora.荆雷奔袭,[稻草人]);
//char.useSkill(Souls.Aurora.失心童话,[稻草人]);
//console.log(char.getBuffStackCountAndT(Souls.Aurora.噩廻))
//console.log(char.buffTable._table)
//console.log(char.dynmaicStatus)
console.log(稻草人.dynmaicStatus)

//console.log(BuffTable)