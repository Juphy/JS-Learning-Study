let sum = require('./sum.js')
console.log(sum.a, JSON.stringify(sum.b))// 1 {"c": 1}
sum.changeA();
sum.changeB();
console.log(sum.a, JSON.stringify(sum.b)) // 1 {"c": 2}
sum.a++;
sum.b.c++;
sum.changeA();
sum.changeB();
console.log(sum.a, JSON.stringify(sum.b)) // 2 {"c":4}