class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]):
        dummy = ListNode(-1)
        cur = dummy
        sum = 0
        while l1 or l2:
            if l1 is not None:
                sum += l1.val
                l1 = l1.next
            if l2 is not None:
                sum += l2.val
                l2 = l2.next
            cur.next = ListNode(sum%10)
            sum = sum//10
            cur = cur.next
        if sum != 0:
            cur.next = ListNode(sum)
        return dummy.next

    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]):
        if not l1:
            return l2
        if not l2:
            return l1
        l1.val += l2.val
        if l1.val >= 10:
            l1.next = self.addTwoNumbers(ListNode(l1.val // 10), l1.next)
            l1.val %= 10
        l1.next = self.addTwoNumbers(l1.next, l2.next)
        return l1