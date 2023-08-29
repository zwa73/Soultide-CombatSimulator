const {DamageCalculator,Aurora,Character, Colcher} = require("./index");
let char = new Character("char1",{
    攻击:10,
    初始怒气:1000
})
let char2 = new Character("char2",{
    攻击:10
})
char.useSkill(Colcher.王女的祝福, [char]);
char.useSkill(Aurora.失心童话,[char2]);

console.log(char.buffTable._table)
console.log(char.dynmaicStatus)
console.log(char2.dynmaicStatus)