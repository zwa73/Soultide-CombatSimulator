const {DamageCalculator,Character, GeneralBuff, Souls, Monsters} = require("./index");
let char = new Character("char1",{
    攻击:10000,
    初始怒气:128
})
let 稻草人 = Monsters.稻草人();

稻草人.addBuff(GeneralBuff.暗蚀,10,1);
char.useSkill(Souls.Colcher.王女的祝福, [char]);
char.useSkill(Souls.Aurora.失心童话,[稻草人]);

console.log(char.buffTable._table)
console.log(char.dynmaicStatus)
console.log(稻草人.dynmaicStatus)