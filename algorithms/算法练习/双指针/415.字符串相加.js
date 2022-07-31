// 415 字符串相加
function addStr(s1, s2) {
    let m = s1.length - 1, n = s2.length - 1
    let ret = '', step = 0
    while (m >= 0 || n >= 0) {
        if (m >= 0) step += +s1[m--]
        if (n >= 0) step += +s2[n--]
        ret = step % 10 + ret
        step = step > 9 ? 1 : 0
    }
    return step > 0 ? step + ret : ret
}
console.log(addStr('998', '671'))