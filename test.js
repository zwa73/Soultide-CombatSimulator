const { Souls, Monsters } = require("./index");
let char = Souls.Aurora.genChar({
    初始怒气:72,
    攻击:6088,
});

let 稻草人 = Monsters.稻草人.genChar();

//稻草人.addBuff(GeneralBuff.暗蚀,10,1);

//char.useSkill(Souls.Colcher.王女的祝福, [char]);
char.useSkill(Souls.Aurora.荆雷奔袭,[稻草人]);
char.dynmaicStatus.当前怒气+=16;
char.useSkill(Souls.Aurora.失心童话,[稻草人]);

console.log(char.buffTable._table)
console.log(char.dynmaicStatus)
console.log(稻草人.dynmaicStatus)