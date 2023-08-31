const { Souls, Monsters, GenericBuff, DefaultBattlefield } = require("./index");

let char = Souls.Aurora.genChar("Aurora",{
    初始怒气:72,
    最大怒气:120,
    攻击:6088,
});

let 稻草人 = Monsters.稻草人.genChar();

稻草人.addBuff(GenericBuff.暗蚀,10,1);
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();
DefaultBattlefield.endRound();

稻草人.useSkill(Souls.Colcher.王女的祝福, [char]);
//char.useSkill(Souls.Aurora.荆雷奔袭,[稻草人]);
char.useSkill(Souls.Aurora.失心童话,[稻草人]);
console.log(char.getBuffStack(Souls.Aurora.噩廻))
//console.log(char.buffTable._table)
//console.log(char.dynmaicStatus)
console.log(稻草人.dynmaicStatus)