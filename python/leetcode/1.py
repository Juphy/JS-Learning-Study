class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        dict = {}
        for i, num in enumerate(nums):
            if num in dict:
                return [dict[num], i]
            dict[target - num] = i

    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashset = {}
        for i in range(len(nums)):
            if hashset.get(target - nums[i]) is not None:
                return [hashset.get(target - nums[i]), i]
            hashset[nums[i]] = i

    def twoSum(self, nums: List[int], target: int) -> List[int]:
        length = len(nums)
        for i in range(length):
            for j in range(i+1, length):
                if nums[i] + nums[j] == target:
                    return [i, j]