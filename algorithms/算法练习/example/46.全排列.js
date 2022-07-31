function permute(nums){
    let ret = [], len = nums.length;
    let path = [], map = {}
    function dfs(){
        if(path.length>len) return
        if(path.length === len){
            ret.push([...path])
            return
        }
        for(let i = 0; i < len; i++){
            if(!map[i]){
                map[i] = true
                path.push(nums[i])
                dfs()
                map[i] = false
                path.pop()
            }
        }
    }
    dfs()
    return ret
}
console.log(permute([1,2,3]))