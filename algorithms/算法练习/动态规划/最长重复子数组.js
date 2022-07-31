// 给两个整数数组 A 和 B ，返回两个数组中公共的、长度最长的子数组的长度。
function findLength(arr1, arr2){
    let dp = [], m = arr1.length, n = arr2.length
    for(let i = 0; i <= m; i++){
        dp[i] = []
        for(let j = 0; j <= n; j++){
            dp[i][j] = 0
        }
    }
    let max = 0
    for(let i = m - 1; i >= 0; i--){
        for(let j = n - 1; j >= 0; j--){
            let a = arr1[i], b = arr2[j]
            if(a === b){
                dp[i][j] = dp[i+1][j+1] + 1
                max = Math.max(max, dp[i][j])
            }else{
                dp[i][j] = 0
            }
        }
    }
    return max
}
let arr1 = [1, 2, 3, 2, 1], arr2 = [3, 2, 1, 4, 7]
console.log(findLength(arr1, arr2))

function findLength1(arr1, arr2){
    let max = 0, m = arr1.length, n = arr2.length
    let dp = []
    for(let i = 0; i <= m; i++){
        dp[i] = [];
        for(let j = 0; j <= n; j++){
            dp[i][j] = 0
        }
    }
    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if(arr1[i-1] === arr2[j-1]){
                dp[i][j] = dp[i-1][j-1] + 1
                max = Math.max(max, dp[i][j])
            }else{
                dp[i][j] = 0
            }
        }
    }
    return max
}

console.log(findLength1(arr1, arr2))