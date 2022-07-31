let a = 1
let b = { c: 1 }
function changeA() {
  a++
}
function changeB() {
  b.c++
}

module.exports = { a, b, changeA, changeB }
