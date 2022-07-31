function f(n) {
    let count = 0
    function dfs(s) {
        if (s > n) return;
        if (s === n) {
            count++
            return
        }
        dfs(s + 1)
        dfs(s + 2)
    }
    dfs(0)
    return count
}
console.log(f(2))
console.log(f(3))
console.log(Date.now())
console.log(f(100))
console.log(Date.now())
function climbStairs(n){
    if(n === 1) return 1
    if(n === 2) return 2
    let cur = 2, pre = 1
    for(let i = 2; i <= n; i++){
        [cur, pre] = [cur+pre, cur]
    }
    return cur
}