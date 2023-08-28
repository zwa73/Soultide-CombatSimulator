const {DamageCalculator,Aurora,Character} = require("./dist");
let char = new Character({
    attack:10,
    startEnergy:1000
})
let char2 = new Character({
    attack:10
})

char.useSkill(Aurora.失心童话,[char2]);

console.log(char.staticStatus)
console.log(char.dynmaicStatus)