function validStr(s) {
    let map = {
        '(': ')',
        '{': '}',
        '[': ']'
    }, stack = [], i = 0, len = s.length
    while(i < len){
        let cur = s[i++]
        if(map[cur]){
            stack.push(cur)
        }else{
            let pre = stack.pop()
            if(!pre || map[pre]!==cur) return false
        }
    }
    return !stack.length
}

console.log(validStr('()'))
console.log(validStr('()[]{}'))
console.log(validStr('(]'))
console.log(validStr('([)]'))
console.log(validStr('{[]}'))