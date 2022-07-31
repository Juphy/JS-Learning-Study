function fib1(n) {
    if (n === 0) return 0
    if (n === 1) return 1
    return fib1(n - 1) + fib(n - 2)
}

function fib4(n, pre, cur) {
    if (n === 0) return pre
    if (n === 1) return cur
    return fib4(n - 1, cur, pre + cur)
}

console.log(Date.now())
console.log(fib4(500, 0, 1))
console.log(Date.now())

// let fib2 = (function () {
//     let map = {}
//     return function (n) {
//         if (map[n]) return map[n]
//         if (n === 0) return map[0] = 0
//         if (n === 1) return map[1] = 1
//         return map[n] = fib2(n - 1) + fib2(n - 2)
//     }
// })()

// console.log(Date.now())
// console.log(fib2(500))
// console.log(Date.now())

let fib3 = function (n) {
    let next = 1n, pre = 0n
    for (let i = 0; i < n; i++) {
        [next, pre] = [next + pre, next]
    }
    return pre
}
console.log(Date.now())
console.log(fib3(1000))
console.log(Date.now())