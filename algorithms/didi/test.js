function fn1(n) {
  let res = [];
  function dsf(s, left, right) {
    if (left > n || left < right) return;
    if (left + right === 2 * n) {
      res.push(s);
      return;
    }
    dsf(s + '(', left + 1, right);
    dsf(s + ')', left, right + 1);
  }
  dsf('', 0, 0);
  return res;
}
console.log(fn1(3));

function fn2(arr) {
  let res = [];
  if (arr.length === 0) {
    return res;
  }
  let len = arr.length, used = {}, path = [];
  function dfs(depth) {
    if (depth === len) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < len; i++) {
      if (!used[i]) {
        path.push(arr[i]);
        used[i] = true;
        dfs(depth + 1);
        path.pop();
        used[i] = false;
      }
    }
  }
  dfs(0);
  return res;
}

console.log(fn2([1, 2, 3]));

function fn3(nums1, nums2) {
  let m = nums1.length - 1, n = nums2.length - 1, len = m + n + 1;
  while (n > -1) {
    if (m < 0) {
      nums1[len--] = nums2[n--];
      continue;
    }
    nums1[len--] = nums1[m] > nums2[n] ? nums1[m--] : nums2[n--];
  }
  return nums1;
}

console.log(fn3([1, 3, 5, 7, 9], [2, 4, 6, 8]));

function fn4(arr) {
  let res = [];
  while (arr.length) {
    let tmp = arr.pop();
    if (Array.isArray(tmp)) {
      arr.push(...tmp);
    } else {
      res.unshift(tmp);
    }
  }
  return res;
}

console.log(fn4([1, [2, [3, [4]]]]));

Array.prototype.flat = function (n = 1) {
  return n > 0 ? this.reduce((a, b) => {
    if (Array.isArray(b)) {
      return [...a, ...b.flat(n - 1)]
    }
    return [...a, b];
  }, []) : this
}

console.log([1, [2, [3, [4]]]].flat(-1))
console.log([1, [2, [3, [4]]]].flat(0))
console.log([1, [2, [3, [4]]]].flat(1))
console.log([1, [2, [3, [4]]]].flat(2))
console.log([1, [2, [3, [4]]]].flat(3))
console.log([1, [2, [3, [4]]]].flat(Infinity))

function fn5(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let s = target - nums[i];
    if (map.has(s)) {
      return [map.get(s), i]
    } else {
      map.set(nums[i], i)
    }
  }
  return [];
}

console.log(fn5([1, 2, 3, 8, 0], 12))

function fn6(nums) {
  if (!nums || nums.length < 3) return [];
  nums.sort((a, b) => a - b);
  let result = [], second, last;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    second = i + 1;
    last = nums.length - 1;
    while (second < last) {
      let s = nums[i] + nums[second] + nums[last];
      if (s === 0) {
        result.push([nums[i], nums[second], nums[last]]);
        while (second < last && nums[second] === nums[second + 1]) second++;
        while (second < last && nums[last] === nums[last + 1]) last--;
        second++;
        last--;
      } else if (s > 0) {
        last--;
      } else if (s < 0) {
        second++;
      }
    }
  }
  return result;
}
console.log(fn6([-9, -8, -7, 0, 1, 2, 4, 6, 8, 9]));

function fn7(nums1, nums2) {
  let res = [];
  for (let i = 0; i < nums1.length; i++) {
    let n = nums1[i];
    if (!res.includes(n) && nums2.includes(n)) {
      res.push(n);
    }
  }
  return res;
}

console.log(fn7([1, 2, 1, 4], [1, 2, 5, 6]))

function fn8(...rest) {
  if (rest.length === 0) return [];
  if (rest.length === 1) return rest[0];
  return rest.reduce((prev, next) => {
    return fn7(prev, next)
  })
}

console.log(fn8([1, 2, 1, 4, 3], [1, 2, 5, 6, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]));

Array.prototype.unique = function () {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    if (this.indexOf(this[i]) === i) {
      res.push(this[i]);
    }
  }
  return res;
}

console.log([1, 2, 3, 4, 777, 8, 9, 5, 2, 1, 3, 4, 6, 7, 3, 3, 3, 4, 4].unique())

function ListNode(val = null, head = null) {
  this.val = val;
  this.head = head;
}

function fn9(head) {
  let prev = null, cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
function fn9(head) {
  if (!head || !head.next) return head;
  let newHead = fn(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

function fn10(num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    unit = ['', '十', '百', '千'],
    res = '';
  num = num.toString();
  function f(s, text = '') {
    let result = '';
    for (let i = s.length - 1; i >= 0; i--) {
      let n = s[i];
      if (n === '0' && !result) { // 末尾为0跳过
        continue;
      } else {
        if (n === '0') {
          if (result[0] !== '零') { // 如果已经有连续零，就不添加了
            result = changeNum[n] + result;
          }
        } else {
          result = changeNum[n] + unit[s.length - 1 - i] + result;
        }
      }
    }
    res = res + (result ? result + text : result);
  }
  f(num.slice(-12, -8), '亿');
  f(num.slice(-8, -4), '万');
  f(num.slice(-4));
  return res;
}
console.log(fn10(123456789));
console.log(fn10(123456789012));
console.log(fn10(111110));
console.log(fn10(10110101));
console.log(fn10(100000000001));

function fn10(num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    unit = ['', '十', '百', '千'],
    res = '';
  num = num.toString();
  function f(str, text = '') {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
      let s = str[i];
      if (s === '0' && !result) {
        continue;
      } else {
        if (s === '0') {
          if (result[0] !== '零') {
            result = changeNum[s] + result;
          }
        } else {
          result = changeNum[s] + unit[str.length - 1 - i] + result;
        }
      }
    }
    res = res + (result ? result + text : result);
  }
  f(num.slice(-12, -8), '亿');
  f(num.slice(-8, -4), '万');
  f(num.slice(-4));
  return res;
}

function fn11(head) {
  while (head) {
    if (head.flag) return true;
    head.flag = true;
    head = head.next;
  }
  return false;
}

function fn12(head) {
  let fast = head, slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }
  return slow;
}

function fn13(head, n) {
  let preHead = new ListNode(0);
  preHead.next = head;
  let fast = preHead, slow = preHead;
  while (n--) {
    fast = fast.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return preHead.next;
}
function fn14(str) {
  let res = '', tmp = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      if (tmp) {
        res = res ? tmp + ' ' + res : tmp;
        tmp = '';
      }
    } else {
      tmp += str[i];
    }
  }
  return tmp ? tmp + ' ' + res : res;
}

console.log(fn14('  hello world! '))

function fn15(...rest) {
  if (!rest || rest.length === 0) return '';
  if (rest.length === 1) return rest[0];
  let prev = rest[0];
  for (let i = 1; i < rest.length; i++) {
    let j = 0;
    for (; j < prev.length && j < rest[i].length; j++) {
      if (prev[j] !== rest[i][j]) break;
    }
    prev = prev.substring(0, j);
    if (prev === '') return '';
  }
  return prev;
}
console.log(fn15('abc123', 'ab23123', 'abderetr'));

function fn16(str) {
  if (str.length <= 1) return str;
  let left = 0, right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}
console.log(fn16('abc121cba1'));

function fn17(str) {
  if (str === '') return str;
  let res = '', len = 0;
  for (let i = 0; i < str.length; i++) {
    let s = str[i];
    if (!res.includes(s)) {
      res += s;
    } else {
      len = Math.max(len, res.length);
      res = s;
    }
  }
  return len;
}

console.log(fn17('aaabbbcdefggghhijklo'));

function fn18(str) {
  let map = {
    '{': '}',
    '(': ')',
    '[': ']'
  };
  let tmp = [];
  for (let i = 0; i < str.length; i++) {
    let s = str[i];
    if (map[s]) {
      tmp.push(s);
    } else {
      if (map[tmp.pop()] !== s) return false;
    }
  }
  return tmp.length === 0;
}
console.log(fn18('([{(){}[]}])'))

function fn19(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val <= l2.val) {
    l1.next = fn19(l1.next, l2);
    return l1
  } else {
    l2.next = fn19(l1, l2.next);
    return l2;
  }
}

function fn20(str) {
  let res = [];
  for (let i = 0; i < str.length; i++) {
    let tmp = res.pop(), s = str[i];
    if (tmp !== s) {
      res.push(tmp);
      res.push(s);
    }
  }
  return res.join('');
}

console.log(fn20('abbaca'));

function MinStack() {
  this.items = [];
  this.min = null;
}

MinStack.prototype.push = function (x) {
  if (!this.items.length) this.min = x;
  this.items.push(x);
  this.min = Math.min(x, this.min);
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

function fn21(num1, num2) {
  let m = num1.length, n = num2.length, res = '', tmp = 0;
  while (m || n) {
    if (m) tmp += +num1[--m];
    if (n) tmp += +num2[--n];
    res = tmp % 10 + res;
    if (tmp > 9) {
      tmp = 1;
    } else {
      tmp = 0;
    }
  }
  return tmp ? tmp + res : res;
}

console.log(fn21('111', '3222'));
console.log(fn21('999', '3222'));

Array.prototype.flat = function (n = 1) {
  return n > 0 ? this.reduce((a, b) => {
    if (Array.isArray(b)) {
      return [...a, ...b.flat(n - 1)]
    }
    return [...a, b]
  }, []) : this;
}
console.log([1, [2, [3, [4]]]].flat(-1))
console.log([1, [2, [3, [4]]]].flat(0))
console.log([1, [2, [3, [4]]]].flat(1))
console.log([1, [2, [3, [4]]]].flat(2))
console.log([1, [2, [3, [4]]]].flat(3))
console.log([1, [2, [3, [4]]]].flat(Infinity))

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

let LRUCache = function (max) {
  this.max = max;
  this.cache = new Map();
}

LRUCache.prototype.get = function (key) {
  // 存在即更新
  if (this.cache.has(key)) {
    let tmp = this.cache.get(key);
    this.cache.set(key, tmp);
    return tmp
  }
  return -1;
}

LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else if (this.cache.size > this.max) {
    // 不存在即加入
    // 如果过长，就删除头部
    this.cache.delete(this.cache.keys().next().value)
  }
  this.cache.set(key, value);
}

Array.prototype.reduce = function (cb, initValue = null) {
  let res = initValue === null ? this[0] : initValue;
  for (let i = initValue === null ? 1 : 0; i < this.length; i++) {
    res = cb(res, this[i], i, this)
  }
  return res;
}

console.log([1, 2, 3, 4, 5].reduce((a, b) => a + b));
console.log([1, 2, 3, 4, 5].reduce((a, b) => a + b, 5));