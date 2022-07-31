// 合并两个有序数组
function merge(num1, num2) {
  let len1 = num1.length - 1,
    len2 = num2.length - 1,
    len = len1 + len2 + 1
  while (len2 > -1) {
    if (len1 < 0) {
      num1[len--] = num2[len2--]
    } else {
      num1[len--] = num1[len1] > num2[len2] ? num1[len1--] : num2[len2--]
    }
  }
  return num1
}

console.log(merge([1, 3, 5, 7, 9], [2, 4, 6, 8]))

// 数组扁平化
/**
 *
 *不传参数
 *<=0
 *infinity
 */
function flat(arr, depth) {
  return depth > 0
    ? arr.reduce((a, b) => {
        if (Array.isArray(b)) {
          return a.concat(flat(b, depth - 1))
        }
        return [...a, b]
      }, [])
    : arr
}
console.log(flat([1, [2, 3, [4, 5, 6, [7, 8]]]], 8))

function flatDeep(arr) {
  let result = [],
    stack = [...arr]
  while (stack.length) {
    let val = stack.pop()
    if (Array.isArray(val)) {
      stack.push(...val)
    } else {
      result.unshift(val)
    }
  }
  return result
}
console.log(flatDeep([1, [2, 3, [4, 5, 6, [7, 8]]]]))
// 去重
// [...new Set([])]
function unique(arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) < 0) res.push(arr[i])
  }
  return res
}

function unique(arr) {
  return arr.filter((item, index, array) => {
    return array.indexOf(item) === index
  })
}

function unique(arr) {
  return arr.sort().reduce((a, b) => {
    if (a.length === 0 || a[a.length - 1] !== b) {
      a.push(b)
    }
    return a
  }, [])
}

// 排序

// 两数之和
function twoSum(nums, target) {
  let map = new Map()
  for (let i = 0; i < nums.length; i++) {
    let k = target - nums[i]
    if (map.has(k)) {
      return [map.get(k), i]
    }
    map.set(nums[i], i)
  }
  return []
}

// 三数之和

// 计算数组的交集 结果唯一
function insertsection(nums1, nums2) {
  return [...new Set(nums1.filter((a) => nums2.includes(a)))]
}

// 计算多个数组的交集
function minsertsection(...rest) {
  if (rest.length === 0) {
    return []
  }
  if (rest.length === 1) {
    return rest[0]
  }
  return [
    ...new Set(
      rest.reduce((a, b) => {
        return a.filter((i) => b.includes(i))
      })
    )
  ]
}
console.log(minsertsection([1, 2, 3, 4, 4], [4, 5, 6, 2, 3], [1, 4, 5, 6, 2]))

// 反转链表
function reverseList(head) {
  let pre = null,
    cur = head
  while (cur) {
    let next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
  return pre
}

function reverseList(head) {
  if (head === null || head.next === null) {
    return head
  }
  let newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}

// 判断一个单链表是否有环
function hasCycle(head) {
  while (head) {
    if (head.flag) return true
    head.flag = true
    head = head.next
  }
  return false
}

// 链表的中间节点
function middleNode(head) {
  let slow = head,
    fast = head
  while (slow && fast.next) {
    // 判断
    slow = slow.next
    fast = fast.next.next
  }
  return slow
}

// 删除链表倒数第n个节点
// 1->2->3->4->5->6=>7=>8=>9 n=2  1-2-3-5
// 单独处理第n个节点
function removeNthFormEnd(head, n) {
  let fast = head,
    slow = head
  while (--n) {
    fast = fast.next
  }
  if (!fast.next) return head.next
  fast = fast.next // 多走n+1
  // fast slow 一起前进
  while (fast && fast.next) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next
}

// 寻找数组中重复最多的数及其次数
function numss(arr) {
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    let num = arr[i]
    if (obj[num]) {
      obj[num]++
    } else {
      obj[num] = 1
    }
  }
  let max = 0,
    res
  for (let key in obj) {
    if (obj[key] > max) {
      max = obj[key]
      res = Number(key)
    }
  }
  return [res, max]
}

// LazyMan 链式调用
// LazyMan('Tony');
// // Hi I am Tony

// LazyMan('Tony').sleep(10).eat('lunch');
// // Hi I am Tony
// // 等待了10秒...
// // I am eating lunch

// LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// // Hi I am Tony
// // I am eating lunch
// // 等待了10秒...
// // I am eating diner

// LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// // Hi I am Tony
// // 等待了5秒...
// // I am eating lunch
// // I am eating dinner
// // 等待了10秒...
// // I am eating junk food
class LazyManClass {
  constructor(name) {
    this.name = name
    this.tasks = []
    this.init()
  }

  init() {
    console.log(`Hi I am ${this.name}`)
    setTimeout(() => {
      // 异步调用，先收集所有的task
      this.next()
    }, 0)
  }

  sleep(ts) {
    let task = () => {
      setTimeout(() => {
        console.log(`等待了${ts}秒`)
        this.next()
      }, ts * 1000)
    }
    this.tasks.push(task)
    return this
  }

  eat(food) {
    let task = () => {
      console.log(`I am eating ${food}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }

  sleepFirst(ts) {
    let task = () => {
      setTimeout(() => {
        console.log(`等待了${ts}秒`)
        this.next()
      }, ts * 1000)
    }
    this.tasks.unshift(task)
    return this
  }

  next() {
    let task = this.tasks.shift()
    task && task()
  }
}

function lazyMan(name) {
  return new LazyManClass(name)
}
lazyMan("Tony")
  .eat("lunch")
  .eat("dinner")
  .sleepFirst(5)
  .sleep(10)
  .eat("junk food")

// class LazyManClass1 {
//   constructor(name) {
//     this.name = name;
//     this.taskList = [];
//     this.init();
//   }

//   init() {
//     console.log(`Hi I am ${this.name}`);
//     // 异步操作，待所有任务都在任务队列中时调用this.next()执行
//     setTimeout(() => {
//       this.next();
//     }, 0);
//   }

//   next() {
//     let task = this.taskList.shift(); // 先进先出
//     task && task();
//   }

//   eat(name) {
//     let task = () => {
//       console.log(`I am eating ${name}`);
//       this.next();
//     }
//     this.taskList.push(task);
//     return this;
//   }

//   sleepFirst(time) {
//     let task = () => {
//       setTimeout(() => {
//         console.log(`等待了${time}秒...`);
//         this.next();
//       }, time * 1000);
//     }
//     this.taskList.unshift(task);
//     return this;
//   }

//   sleep(time) {
//     let task = () => {
//       setTimeout(() => {
//         console.log(`等待了${time}秒...`);
//         this.next();
//       }, time * 1000);
//     }
//     this.taskList.push(task);
//     return this;
//   }
// }

// function LazyMan(name) {
//   return new LazyManClass1(name);
// }
// LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(4).eat('junk food');
function deepCopy(target, map = new Map()) {
  if (map.get(target)) {
    return target
  }
  let constructor = target.constructor
  if (/^(RegExp | Date)$/.test(constructor.name)) {
    return new constructor(target)
  }
  if (
    target !== null &&
    (typeof target === "object" || typeof target === "function")
  ) {
    map.set(target, true)
    let result = Array.isArray(target) ? [] : {}
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        result[key] = deepCopy(target[key], map)
      }
    }
    return result
  } else {
    return target
  }
}

Array.prototype.flatten = function (deepth = 1) {
  return deepth > 0
    ? this.reduce((a, b) => {
        if (Array.isArray(b)) {
          return a.concat(b.flatten(deepth - 1))
        }
        return a.concat(b)
      }, [])
    : this
}
arr = [1, [2, [3, [4, [5, [6, 7, [8]]]]]]]
console.log(arr.flatten(1))
console.log(arr.flatten(2))
console.log(arr.flatten(3))
console.log(arr.flatten(4))
console.log(arr.flatten(Infinity))
function bubbleSort(arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
function selectSort(arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    let minIndex = i
    for (let j = minIndex + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j
      }
    }
    ;[arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
  }
  return arr
}

function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let preIndex = i - 1,
      current = arr[i]
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = current
  }
  return arr
}
arr = [4, 3, 1, 2, 9, 7, 6, 8]
console.log(bubbleSort(arr))
arr = [4, 3, 1, 2, 9, 7, 6, 8]
console.log(selectSort(arr))
arr = [4, 3, 1, 2, 9, 7, 6, 8]
console.log(insertSort(arr))

function quickSort(arr) {
  if (arr.length < 2) return arr
  let mid = arr.splice(Math.floor(arr.length / 2), 1)[0]
  let left = [],
    right = []
  for (let i = 0; i < arr.length; i++) {
    let value = arr[i]
    if (value > mid) {
      right.push(value)
    } else {
      left.push(value)
    }
  }
  return quickSort(left).concat(mid, quickSort(right))
}
arr = [4, 3, 1, 2, 9, 7, 6, 8]
console.log(quickSort(arr))

function reverseArr(arr) {
  let left = 0,
    right = arr.length - 1
  while (left < right) {
    if (arr[left] !== arr[right]) {
      return false
    }
    left++
    right--
  }
  return true
}
console.log(reverseArr("assa"))
console.log(reverseArr("asasa"))
console.log(reverseArr("adasa"))

Array.prototype.map = function (cb, context = null) {
  let result = []
  for (let i = 0; i < this.length; i++) {
    result.push(cb.call(context, this[i], i, this))
  }
  return result
}

Array.prototype.filter = function (cb, context = null) {
  let result = []
  for (let i = 0; i < this.length; i++) {
    if (cb.call(context, this[i], i, this)) {
      result.push(this[i])
    }
  }
  return result
}

Array.prototype.reduce = function (cb, initvalue) {
  let prev = initvalue === undefined ? this[0] : initvalue;
  for(let i = initvalue === undefined?0:1; i < this.length; i++){
    prev = cb(prev, this[i], i, this);
  }
  return prev;
}

Array.prototype.forEach = function(cb, context){
  if(this == null){
    throw new TypeError('this is null or undefined')
  }
  if(typeof cb !== 'function'){
    throw new TypeError(cb + 'is not a function')
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while(k < len){
    if(k in O){
      cb.call(context, O[k], k, O)
    }
    k++;
  }
}

Array.prototype.map = function(cb, context){
  if(this == null){
    throw new TypeError('this is null or not defined');
  }
  if(typeof cb !== 'function'){
    throw new TypeError(cb + 'is not a function');
  }
  const O = Object(this), i = O.length >>> 0;
  let k = 0, res = [];
  while(k < len){
    if(k in O){
      res.push(cb.call(context, ))
    }
  }
}