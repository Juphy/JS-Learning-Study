// 3 无重复最长子串
function longStr(s) {
    if (s === '') return 0
    let ret = s[0], max = 1;
    for (let i = 1, len = s.length; i < len; i++) {
        let cur = s[i]
        if (!ret.includes(cur)) {
            ret = ret + cur
        } else {
            max = Math.max(max, ret.length)
            ret = cur
        }
    }
    return max
}
s = 'abcabcbb'
console.log(longStr(s))
s = ''
console.log(longStr(s))