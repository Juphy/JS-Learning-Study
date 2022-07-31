/**
 * 
 * @param {number[]} arr1 长度为合并后数组长度
 * @param {number} m 
 * @param {number[]} arr2 
 * @param {number} n 
 */
let merge = function(arr1, m, arr2, n){
    let i = m - 1, j = n -1
    let k = arr1.length - 1
    while(i >= 0 && j >= 0){
        let num1 = arr1[i], num2 = arr2[j]
        arr1[k--] = num1 > num2? arr1[i--] : arr2[j--] 
    }
    while(j >= 0){
        arr1[k--] = arr2[j--]
    }
    return arr1
}

let arr1 = [1,3,5,7,9], arr2 = [2,4,6,8,10]
arr1.length = 10
console.log(merge(arr1, 5, arr2, 5))