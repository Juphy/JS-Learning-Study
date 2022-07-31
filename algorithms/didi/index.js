// 给定数字 括号生成
function fn1(n) {
  let res = [];

  function dfs(s, left, right) {
    if (left > n || left < right) {
      return;
    }
    if (left + right === 2 * n) {
      res.push(s);
    } else {
      dfs(s + '(', left + 1, right);
      dfs(s + ')', left, right + 1);
    }
  }
  dfs('', 0, 0);
  return res;
}

console.log(fn1(3));

// 全排列
// 回溯算法是一种搜索法，试探法，在没做出一步选择时，一旦不符合期望就会进行判断
// 递归终止条件，当前递归到第几层，depth表示当前要确定的是某个全排列中下标为index
// used用于把表示一个数是否被选中，如果这个数字被选择则设置为used[num] = true，以空间换时间
function fn2(nums) {
  // 使用一个数组保存所有可能的全排列
  let res = [];
  if (nums.length === 0) {
    return res;
  }
  let used = {},
    path = [],
    len = nums.length;

  function dfs(depth) {
    if (depth === len) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < len; i++) {
      if (!used[i]) {
        path.push(nums[i]);
        used[i] = true;
        // 继续递归填下一个数
        dfs(depth + 1);
        // 撤销操作
        used[i] = false;
        path.pop();
      }
    }
  }
  dfs(0);
  return res;
}
console.log(fn2([1, 2, 3]));

// 合并有序数组
function fn3(nums1, nums2) {
  let m = nums1.length - 1,
    n = nums2.length - 1,
    len = m + n + 1;
  while (n > -1) {
    if (m < 0) {
      nums[len--] = nums2[n--];
      continue;
    }
    console.log(m, n, len);
    nums1[len--] = nums1[m] > nums2[n] ? nums1[m--] : nums2[n--];
  }
  return nums1;
}

console.log(fn3([1, 3, 5, 7, 9], [2, 4, 6, 8]));

// 数组扁平
function fn4(arr) {
  let res = [];
  while (arr.length) {
    let tmp = arr.pop();
    if (Array.isArray(tmp)) {
      arr = arr.concat(tmp);
    } else {
      res.unshift(tmp);
    }
  }
  return res;
}

console.log(fn4([1, [2, [3, [4, [5]]]]]));

// 两数之和
function fn5(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let res = target - nums[i];
    if (map.has(res)) {
      return [map.get(res), i]
    } else {
      map.set(nums[i], i);
    }
  }
  return [];
}

console.log(fn5([1, 4, 9, 12, 15], 27));

// 三数之和
// 先排序 在去重 深度广遍历
function fn6(nums) {
  if (!nums || nums.length < 3) return [];
  let res = [],
    second, last;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    second = i + 1;
    last = nums.length - 1;
    while (second < last) {
      let sum = nums[i] + nums[second] + nums[last];
      if (sum === 0) {
        res.push([nums[i], nums[second], nums[last]]);
        // 去重
        while (second < last && nums[second] === nums[second + 1]) second++;
        while (second < last && nums[last] === nums[last - 1]) last--;
        second++;
        last--;
      } else if (sum > 0) {
        last--
      } else if (sum < 0) {
        second++
      }
    }
  }
  return res;
}

console.log(fn6([-9, -8, -7, 0, 1, 2, 4, 6, 8, 9]));

// 数组交集
function fn7(nums1, nums2) {
  return [...new Set(nums1.filter(i => nums2.includes(i)))]
}

function fn7(nums1, nums2) {
  let res = [];
  for (let i = 0; i < nums1.length; i++) {
    let s = nums1[i];
    if (!res.includes(s) && nums2.includes(s)) {
      res.push(s)
    }
  }
  return res
}
console.log(fn7([1, 2, 1, 4], [1, 2, 5, 6]))

// 多个数组的合集
function fn8(...rest) {
  if (rest.length === 0) return [];
  if (rest.length === 1) return rest[0];
  return [...new Set(rest.reduce((prev, next) => {
    return prev.filter(i => next.includes(i))
  }))]
}

Array.prototype.unique = function () {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    if (this.indexOf(this[i]) === i) {
      res.push(this[i])
    }
  }
  return res;
}

console.log([1, 2, 3, 4, 777, 8, 9, 5, 2, 1, 3, 4, 6, 7, 3, 3, 3, 4, 4].unique())

function ListNode(val = 0, head = null) {
  this.val = val;
  this.next = head;
}

// 反转链表
function fn9(head) {
  let prev = null,
    cur = head;
  while (cur) {
    // 用于临时存储cur后继节点
    let next = cur.next;
    // 反转cur的后继指针
    cur.next = prev;
    // 变更prev cur
    prev = cur;
    cur = next;
  }
  return prev;
}

function fn9(head) {
  if (!head || !head.next) return head;
  let newHead = fn9(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

function fn10(num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ['', '十', '百', '千'];
  let res = '';
  num = num.toString();

  function f(s, text = '') {
    if (!s) return;
    let result = '';
    for (let i = s.length - 1; i >= 0; i--) {
      let n = s[i];
      if (n === '0' && !result) {
        continue;
      } else {
        if (n === '0') {
          if (result[0] !== '零') {
            result = changeNum[n] + result;
          }
        } else {
          result = changeNum[n] + unit[s.length - i - 1] + result;
        }
      }
    }
    res = res + (result ? result + text : '')
  }
  f(num.slice(-12, -8), '亿')
  f(num.slice(-8, -4), '万')
  f(num.slice(-4))
  return res;
}
console.log(fn10(123456789));
console.log(fn10(123456789012));
console.log(fn10(111110));
console.log(fn10(10000101));
console.log(fn10(100000000001));

// 链表有环
function fn11(head) {
  while (head) {
    if (head.flag) return true;
    head.flag = true;
    head = head.next;
  }
  return false;
}

// 链表中间节点
function fn12(head) {
  let fast = head,
    slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }
  return slow;
}

// 删除链表倒数第n个节点
function fn13(head, n) {
  let preHead = new ListNode(0);
  preHead.next = head;
  let fast = preHead,
    slow = preHead;
  while (n--) {
    fast = fast.next;
  }
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return preHead.next;
}

// 反转字符串
function fn14(str) {
  let res = '',
    s = '';
  for (let i = 0; i < str.length; i++) {
    let _s = str[i];
    if (_s !== ' ') {
      s += _s;
    } else {
      if (s) {
        res = res ? (s + ' ' + res) : s
        s = '';
      }
    }
  }
  res = s ? (s + ' ' + res) : res;
  return res;
}
console.log(fn14("  hello  world!  "))
console.log(fn14("  hello  world! qwe 123"))

// 最长公共前缀
function fn15(strs) {
  if (!strs || strs.length === 0) return '';
  let res = strs[0];
  for (let i = 1; i < strs.length; i++) {
    let j = 0;
    for (; j < res.length && j < strs[i].length; j++) {
      if (res[j] !== strs[i][j]) break;
    }
    res = res.substring(0, j);
    if (res === '') return '';
  }
  return res;
}
console.log(fn15(['abc123', 'ab23123', 'abderetr']))

// 回文字符串
function fn16(str) {
  let left = 0,
    right = str.length - 1;
  while (left < right) {
    if (str.charAt(left) !== str.charAt(right)) return false;
    left++;
    right--;
  }
  return true;
}

// 有效的括号
function fn17(str) {
  let o = {
    "{": "}",
    "(": ")",
    "[": "]",
  }
  let tmp = [];
  for (let i = 0; i < str.length; i++) {
    let s = str[i];
    if (o[s]) {
      tmp.push(s);
    } else {
      if (s !== o[tmp.pop()]) return false;
    }
  }
  return tmp.length === 0;
}

function MinStack() {
  this.items = [];
  this.min = null;
}
MinStack.prototype.push = function (s) {
  if (!this.items.length) this.min = x;
  this.min = Math.min(x, this.min);
  this.items.push(s);
}
MinStack.prototype.pop = function () {
  let num = this.items.pop();
  this.min = Math.min(...this.items);
  return num;
}
MinStack.prototype.top = function () {
  if (!this.items.length) return null;
  return this.items[this.items.length - 1];
}
MinStack.prototype.getMin = function () {
  return this.min;
}

// 删除字符串中所有相邻重复项
function fn18(str) {
  let res = [];
  for (let i = 0; i < str.length; i++) {
    let prev = res.pop(),
      s = str[i];
    if (prev !== s) {
      res.push(prev);
      res.push(s);
    }
  }
  return res.join('');
}

console.log(fn18('abbaca'));

// LRU
function LRUCache(capacity) {
  this.cache = new Map();
  this.capacity = capacity;
}

LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    // 存在即更新
    let tmp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, tmp); // 重新插入，保持最新
    return tmp;
  }
  return -1;
}

// Map既能保持键值对，同时 Map 的遍历顺序就是插入顺序
LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) {
    // 存在即更新（删除后再加入）
    this.cache.delete(key);
  } else if (this.cache.size >= this.capacity) {
    // 不存在即加入
    // 缓存超过最大值，则移除最近没有使用的
    this.cache.delete(this.cache.keys().next().value)
  }
  this.cache.set(key, value);
}

// 合并两个有序链表
function fn19(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val <= l2.val) {
    l1.next = fn19(l1.next, l2);
    return l1;
  } else {
    l2.next = fn19(l1, l2.next);
    return l2;
  }
}

// 给定字符串计算和
function fn20(num1, num2) {
  let m = num1.length,
    n = num2.length,
    res = '',
    tmp = 0;
  while (m || n) {
    if (m) tmp += +num1[--m];
    if (n) tmp += +num2[--n];
    res = tmp % 10 + res;
    // 进位处理
    if (tmp > 9) tmp = 1
    else tmp = 0
  }
  if (tmp) res = tmp + res;
  return res;
}
console.log(fn20('888', '3222'));

function fn21(template, context) {
  return template.replace(/\{\{(.*?)\}\}/g, function (match, key) {
    return context[key];
  })
}

console.log(fn21("{{name}}很厉害，才{{age}}岁", {
  name: 'Tom',
  age: '22'
}))

Array.prototype.reduce = function (cb, initVal) {
  let result = initVal === undefined ? this[0] : initVal;
  for (let i = (initVal === undefined ? 0 : 1); i < this.length; i++) {
    result = cb.apply(result, this[i], i, this);
  }
  return result;
}

Array.prototype.map = function (cb, context = null) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(cb.call(context, this[i], i, this));
  }
  return res;
}

Array.prototype.indexOf = function (target, start = 0) {
  if (start < 0) start = this.length + start;
  if (start >= this.length) return -1;
  for (let i = start; i < this.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

Array.prototype.splice = function (start, count = 0, ...rest) {
  let array = Object(this),
    len = array.length,
    res = new Array(count);

  // 拷贝删除的元素
  function deleteElements() {
    for (let i = 0; i < count; i++) {
      let index = start + i;
      if (index in array) {
        res[i] = array[index];
      }
    }
  }

  // 移动删除元素后面的元素
  function moveElements() {
    let length = rest.length;
    if (length === count) {
      return;
    } else if (count > length) {
      // len + length-count < len
      // [1,2,3,4,5].splice(1,2,6) => [1,2,4,5,5]=>[1,2,4,5]
      // 删除的数量多 后面的元素需要向前挪动
      for (let i = start + count; i < len; i++) {
        let fromIndex = i;
        let toIndex = i - (count - length);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex];
        } else {
          delete array[toIndex];
        }
      }
      for (let i = len - 1; i >= len + length - count; i--) {
        delete array[i];
      }
    } else if (count < length) {
      // len + length - count > len
      // [1,2,3,4,5].splice(1,1,6,7) => [1,2,3,4,5]=>[1,2,3,3,4,5]
      // 删除的数量少于 添加的数量时 整体向后偏移
      for (let i = len - 1; i >= start + count; i--) {
        let fromIndex = i;
        let toIndex = i + (length - count);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex]
        }
      }
    }
  }
  deleteElements()
  moveElements();
  // 添加新元素
  for (let i = 0; i < rest.length; i++) {
    array[start + i] = rest[i];
  }
  array.length = len - count + rest.length;
  return res;
}
a = [1, 2, 3, 4, 5, 6];
b = [1, 2, 3, 4, 5, 6];
c = [1, 2, 3, 4, 5, 6];
console.log(a.splice(0));
console.log(b.splice(0, 0, 7, 8));
console.log(c.splice(0, 1, 7, 8));
console.log(a, b, c);

// 最小的k个数
function fn22(arr, k) {
  let res = [],
    i = 0;
  while (i < k) {
    res.push(arr[i++])
  }
  for (let i = k; i < arr.length; i++) {
    let n = arr[i];
    for (let j = 0; j < res.length; j++) {
      if (res[j] > n) {
        [res[j], n] = [n, res[j]]
      }
    }
  }
  return res;
}
console.log(fn22([7, 8, 9, 1, 3, 4, 5, 7, 8, 1, 2, 34, 5], 4));

// 前k个高频元素
function fn23(arr, k) {
  let map = new Map();
  for (let i = 0; i < arr.length; i++) {
    let n = arr[i];
    if (map.has(n)) {
      map.set(n, map.get(n) + 1);
    } else {
      map.set(n, 1)
    }
  }
  return [...new Set(arr)].sort((a, b) => map.get(b) - map.get(a)).slice(0, k);
}

// 数组中第k个最大元素
function fn24(arr, k) {
  arr.sort((a, b) => a - b);
  return arr[k - 1];
}

// 寻找中位数
function fn25(arr) {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    left++;
    right--;
  }
  return (arr[left] + arr[right]) / 2;
}
console.log(fn25([1, 2, 3]));
console.log(fn25([2, 3]));

// 字符串中重复k倍
function fn26(str, k) {
  let res = [];
  for (let i = 0; i < str.length; i++) {
    let prev = res.pop(),
      s = str[i];
    if (!prev || prev[0] !== s) {
      res.push(prev);
      res.push(s);
    } else if (prev.length < k - 1) { // 
      res.push(prev + s);
    }
  }
  return res.join('');
}

console.log(fn26('deeedbbcccbdaa', 3))
// 冒泡排序 找出最大的放在最后
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let flag = false;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = true;
      }
    }
    if (!flag) break;
  }
  return arr;
}
console.log(bubbleSort([45, 1, 34, 67, 89, 2]))

// 选择排序 找出最小的放在前面
function selectSort(arr) {
  let min, len = arr.length;
  for (let i = 0; i < len; i++) {
    min = i;
    for (let j = i; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    if (i !== min) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}
console.log(selectSort([45, 1, 34, 67, 89, 2]));

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = arr.splice(Math.floor(arr.length / 2), 1)[0];
  let left = [],
    right = [];
  console.log(mid);
  for (let i = 0; i < arr.length; i++) {
    let n = arr[i];
    if (mid > n) {
      left.push(n);
    } else {
      right.push(n);
    }
  }
  return quickSort(left).concat(mid, quickSort(right));
}

console.log(quickSort([45, 1, 34, 67, 89, 2]));

function fn27(arr, target) {
  let res = [-1, -1];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      if (res[0] < 0) {
        res = [i, i]
      } else {
        res[1] = i;
      }
    }
    if (arr[i] > target) {
      return res;
    };
  }
  return res;
}

console.log(fn27([5, 7, 7, 8, 8, 8, 8, 8, 10], 8));
console.log(fn27([5, 7, 7, 8, 8, 10], 6));

function fn28(num, radix) {
  let res = '';
  while (num > 0) {
    res = num % radix + res;
    num = Math.floor(num / radix);
  }
  if (num !== 0) res = num + res;
  return res;
}
a = 100;
console.log(fn28(100, 8));
console.log(a.toString(8));