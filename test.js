const {DamageCalculator,Aurora,Character} = require("./dist");
let char = new Character("char1",{
    攻击:10,
    初始怒气:1000
})
let char2 = new Character("char2",{
    攻击:10
})

char.useSkill(Aurora.失心童话,[char2]);

console.log(char.buffTable)
console.log(char.dynmaicStatus)