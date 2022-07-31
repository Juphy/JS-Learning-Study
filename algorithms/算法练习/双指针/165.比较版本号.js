// 165 比较版本号
function compareVersion(v1, v2) {
    let m = v1.length, n = v2.length
    let i = 0, j = 0
    while (i < m || j < n) {
        let x = 0, y = 0
        while (i < m) {
            if (v1[i] !== '.') {
                x = x * 10 + (+v1[i++])
            } else {
                i++
                break;
            }
        }
        while (j < n) {
            if (v2[j] !== '.') {
                y = y * 10 + (+(v2[j++] || 0))
            } else {
                j++
                break;
            }
        }
        if (x > y) return 1
        if (x < y) return -1
    }
    return 0
}

console.log(compareVersion('1.01', '1.001'))
console.log(compareVersion('1.0', '1.0.0'))
console.log(compareVersion('0.1', '1.1'))
console.log(compareVersion('1.0.1', '1'))
console.log(compareVersion('7.5.2.4', '7.5.3'))

function diffVersion(v1, v2) {
    v1 = v1.split('.'), v2 = v2.split('.')
    let i = 0, m = v1.length, n = v2.length
    while (i < m || i < n) {
        let a = +(v1[i] || 0), b = +(v2[i] || 0)
        if (a > b) {
            return 1
        }
        if (a < b) {
            return -1
        }
        i++
    }
    return 0
}

console.log(diffVersion('1.01', '1.001'))
console.log(diffVersion('1.0', '1.0.0'))
console.log(diffVersion('0.1', '1.1'))
console.log(diffVersion('1.0.1', '1'))
console.log(diffVersion('7.5.2.4', '7.5.3'))