const { Souls, Monsters, GenericBuff } = require("./index");

let char = Souls.Aurora.genChar("Aurora",{
    初始怒气:72,
    攻击:6088,
});

let 稻草人 = Monsters.稻草人.genChar();

稻草人.addBuff(GenericBuff.暗蚀,10,1);

稻草人.useSkill(Souls.Colcher.王女的祝福, [char]);
char.useSkill(Souls.Aurora.荆雷奔袭,[稻草人]);
char.dynmaicStatus.当前怒气+=16;
char.useSkill(Souls.Aurora.失心童话,[稻草人]);

//console.log(char.buffTable._table)
//console.log(char.dynmaicStatus)
//console.log(稻草人.dynmaicStatus)