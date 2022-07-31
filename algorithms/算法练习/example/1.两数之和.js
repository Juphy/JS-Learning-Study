function getTarget(nums, target){
    let map = new Map(), i = 0, len = nums.length
    while(i < len){
        let cur = nums[i]
        if(map.has(cur)){
            return [map.get(cur), i]
        }else{
            map.set(target-cur, i)
            i++
        }
    }
}
console.log(getTarget([3, 2, 4], 6))