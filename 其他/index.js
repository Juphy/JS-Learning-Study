// typeof 可以识别number boolean undefined string function symbol. null和其它对象会被识别为object
function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

// 原型链继承: 1无法初始化参数 2引用数据类型会所有实例共享
function Animal() {
    this.colors = ['black', 'white']
}
Animal.prototype.getColor = function () {
    return this.colors
}
function Dog() { }
Dog.prototype = new Animal();

// 构造函数: 定义在构造函数中的函数，每次实例的时候都需要创建一遍
function Animal(name) {
    this.name = name;
    this.getName = function () {
        return this.name
    }
}
function Dog(name) {
    Animal.call(this, name)
}
Dog.prototype = new Animal();

// 组合继承：
function Animal(name) {
    this.name = name;
    this.colors = ['black', 'white'];
}
Animal.prototype.getName = function () {
    return this.name;
}
function Dog(name, age) {
    Animal.call(this, name);
    this.age = age;
}
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

// 寄生组合继承
let inherit = (function () {
    let F = function () { };
    return function (target, origin) {
        F.prototype = origin.prototype;;
        target.prototype = new F();
        target.prototype.constructor = target;
        target.prototype.uber = origin.prototype;
    }
})()

function unique(arr) {
    return [...new Set(arr)]
}
function unique(arr) {
    return arr.filter(function (item, index) {
        return arr.indexOf(item) === index
    })
}

template = '{{name}}很厉害，才{{age}}岁';
context = { name: 'Tom', age: 20 };
function render(template, context) {
    return template.replace(/{{(.*?)}}/g, (macth, key) => context[key.trim()])
}
console.log(render(template, context))

// 数组扁平化，并去重排序
let arr = [2, [1, [4, [3], 6], 5], 2];
console.log([...new Set(arr.toString().split(',').sort((a, b) => a - b))])

function flatten(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]))
        } else {
            res.push(arr[i])
        }
    }
    return res;
}

function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

function mergeArr(arr, brr) {
    let m = arr.length, n = brr.length, len = m + n + 1;
    while (n > -1) {
        if (m < 0) {
            arr[len--] = brr[n--];
            continue;
        }
        arr[len--] = arr[m] > brr[n] ? arr[m--] : brr[n--];
    }
}

class EventEmitter {
    constructor() {
        this.events = Object.create(null)
    }

    on(event, fn) {
        if (arguments.length < 2) return this;
        if (Array.isArray(event)) {
            for (let i = 0, len = event.length; i < len; i++) {
                this.on(event[i], fn)
            }
        } else {
            (this.events[event] || (this.events[event] = [])).push(fn)
        }
    }

    once(event, fn) {
        function _on() {
            this.off(event, _on);
            fn.apply(this, arguments)
        }
        _on.fn = fn;
        this.on(event, _on);
        return this;
    }

    off(event, fn) {
        if (!arguments.lengt) return this;
        if (Array.isArray(event)) {
            for (let i = 0, len = event.length; i < len; i++) {
                this.off(event[i], fn)
            }
            return this;
        }
        if (arguments.length === 1) {
            this.events[event] = Object.create(null);
            return this;
        }
        let cbs = this.events[event];
        if (!cbs) return this;
        let cb, len = cbs.length;
        while (len--) {
            cb = cbs[len];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(len, 1);
                break;
            }
        }
        return this;
    }
    emit(event) {
        let cbs = this.events[event]
        if (cbs) {
            cbs = Array.from(cbs);
            let args = Array.prototype.slice.call(arguments, 1);
            for (let i = 0, len = cbs.length; i < len; i++) {
                cbs[i].apply(this, args)
            }
        }
        return this;
    }
}

function arraytotree(arr) {
    let result = [], map = {};
    for (let item of arr) {
        let id = item.id, pid = item.pid;
        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            ...item,
            children: map[id].children
        }
        let mapItem = map[id];
        if (pid === 0) {
            result.push(mapItem)
        } else {
            if (!map[pid]) {
                map[pid] = { children: [] }
            }
            map[pid].children.push(mapItem)
        }
    }
    return result;
}

Array.prototype.flatten = function (depth = 1) {
    if (depth > 0) {
        return this.reduce((a, b) => {
            if (Array.isArray(b)) {
                return a.concat(b.flatten(depth - 1))
            } else {
                return a.concat(b)
            }
        }, [])
    } else {
        return this;
    }
}

arr = [1, [2, [3, [4, [5, [6]]]]]]
console.log(arr.flatten(1));

arr = [4, 6, 5, 3, 1, 2, 9, 7, 8];
function bubbleFn(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
        console.log(arr);
    }
    return arr
}

function bubbleSort(arr) {
    let i = arr.length;
    while (i > 0) {
        var pos = 0;
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                pos = j;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
        console.log(arr, pos)
        i = pos;
    }
    return arr
}

function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
    return arr
}

function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; i < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}

function bubbleSort(arr) {
    let i = arr.length;
    while (i > 0) {
        let pos = 0
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                pos = j;
            }
        }
        i = pos;
    }
    return arr;
}

function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
    }
    return arr;
}

function insertSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let preIndex = i - 1,
            current = arr[i];
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
        console.log(arr);
    }
    return arr
}
arr = [4, 6, 5, 3, 1, 2, 9, 7, 8];
console.log(insertSort(arr))

function insertSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let preIndex = i - 1;
        current = arr[i];
        if (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}

function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j
            }
        }
        [arr[minIndex], arr[j]] = [arr[j], arr[minIndex]]
    }
    return arr;
}

function insertSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let preIndex = i - 1,
            current = arr[i];
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = arr.splice(Math.floor(arr.length / 2), 1)[0];
    let left = [], right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < mid) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(mid, quickSort(right))
}

class LazyMan {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.init();
    }

    init() {
        console.log(`Hi I am ${this.name}`)
        setTimeout(() => {
            this.next();
        }, 0)
    }

    sleep(ts) {
        let task = () => {
            setTimeout(() => {
                console.log(`等待了${ts}秒`);
                this.next();
            }, ts * 1000)
        }
        this.tasks.push(task);
        return this;
    }

    eat(food) {
        let task = () => {
            console.log(`I am eating ${food}`);
            this.next();
        }
        this.tasks.push(task);
        return this;
    }

    sleepFirst(ts) {
        let task = () => {
            setTimeout(() => {
                console.log(`等待了${ts}秒`);
                this.next();
            }, ts * 1000)
        }
        this.tasks.unshift(task);
        return this;
    }

    next() {
        let task = this.tasks.shift();
        task && task();
    }
}

let lazyMan = function (name) {
    return new LazyMan(name)
}
lazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');

function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr;
}
arr = [3, 2, 4, 1, 9, 6, 8, 7];
console.log(bubbleSort(arr))

function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
    }
    return arr;
}
arr = [3, 2, 4, 1, 9, 6, 8, 7];
console.log(selectSort(arr))

function insertSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let preIndex = i - 1, current = arr[i];
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}
arr = [3, 2, 4, 1, 9, 6, 8, 7];
console.log(insertSort(arr))

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = arr.splice(Math.floor(arr.length / 2), 1)[0];
    let left = [], right = [];
    for (let i = 0; i < arr.length; i++) {
        let value = arr[i];
        if (mid > value) {
            left.push(value)
        } else {
            right.push(value)
        }
    }
    return quickSort(left).concat(mid, quickSort(right))
}
arr = [3, 2, 4, 1, 9, 6, 8, 7];
console.log(quickSort(arr))

function debounce(cb, delay, immediate) {
    let timer;
    return function () {
        if (!timer && immediate) {
            cb.apply(this, arguments)
        }
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            cb.apply(this, arguments)
        }, delay)
    }
}

function throttle(cb, delay, immediate) {
    let timer, callNow = immediate;
    return function () {
        if (callNow) {
            callNow = false;
            cb.apply(this, arguments)
        }
        if (!timer) {
            timer = setTimeout(() => {
                cb.apply(this, arguments);
                timer = null;
            }, delay)
        }
    }
}

function arrayToTree(arr) {
    let result = [], map = {};
    for (let item of arr) {
        let pid = item.pid, id = item.id;
        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            ...item,
            children: map[id].children
        }
        let mapItem = map[id];
        if (pid === 0) {
            result.push(mapItem)
        } else {
            if (!map[pid]) {
                map[pid] = {
                    children: []
                }
            }
            map[pid].children.push(mapItem)
        }
    }
    return result
}

arr = [
    { pid: 0, id: 1, name: '1' },
    { pid: 1, id: 2, name: '2' },
    { pid: 1, id: 3, name: '3' },
    { pid: 2, id: 4, name: '4' },
    { pid: 3, id: 5, name: '5' },
    { pid: 3, id: 6, name: '6' },
    { pid: 4, id: 7, name: '7' }
]

console.log(arrayToTree(arr))

function typeOf(value) {
    return Object.prototype.toString.call(value).slice(-8, -1).toLowerCase()
}

function deepClone(target, map = new Map()) {
    if (map.get(target)) {
        return target
    }
    let constructor = target.constructor;
    if (/^(RegExp|Date)$/.test(constructor.name)) {
        return new constructor(target)
    }
    if (target !== null && (typeof target === 'object' || typeof target === 'function')) {
        map.set(target, true)
        if (typeof target === 'function') {
            return new Function('return ' + target.toString())()
        } else {
            let result = Array.isArray(target) ? [] : {};
            for (let key in target) {
                if (target.hasOwnProperty(key)) {
                    result[key] = deepClone(target[key], map)
                }
            }
            return result
        }
    }
    return target
}

function curry(fn) {
    return function curried(...args) {
        if (args.length < fn.length) {
            return function (...args2) {
                return curried.apply(this, args.concat(args2))
            }
        }
        return fn.apply(this, args)
    }
}

function sum(a, b, c) {
    return a + b + c
}
console.log(curry(sum)(1)(2)(3))

async function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay)
    })
}
(async function () {
    console.log(Date.now())
    await sleep(1000)
    console.log(Date.now())
})()

function assign(target, ...source) {
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
    }
    return source.reduce((prev, next) => {
        if (!(prev !== null && (typeof prev === 'object' || typeof next === 'function'))) {
            prev = new Object(prev)
        }
        if (next == null) return prev;
        [...Object.keys(next), ...Object.getOwnPropertySymbols(next)].forEach(key => {
            prev[key] = next[key]
        })
        return prev
    }, target)
}

function instanceOf(left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto == null) return false;
        if (proro === right.prototype) return true;
        proto = Object.getPrototypeOf(proto)
    }
}

Array.prototype.find = function (cb, context) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while (k < len) {
        let val = O[k]
        if (cb.call(context, val, k, O)) {
            return val
        }
        k++
    }
    return undefined
}

Array.prototype.some = function (cb, context) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while (k < len) {
        if (k in O && cb.call(context, O[k], k, O)) {
            return true
        }
        k++
    }
    return false
}

Array.prototype.flat = function (depth = 1) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    depth = Number(depth);
    if (isNaN(depth) || depth <= 0) {
        depth = 0
    } else {
        depth = Math.floor(depth)
    }
    return depth > 0 ? this.reduce((prev, next) => {
        if (Array.isArray(next)) {
            return prev.concat(next.flat(depth - 1))
        }
        return prev.concat(next)
    }, []) : this
}

// reduce concat
function flatDeep(arr = [], depth = 1) {
    return depth > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, depth - 1) : val), []) : arr.slice()
}

// forEach
function eachFlat(arr = [], depth = 1) {
    const result = []
        (function flat() {
            // forEach自动去除数组空位
            arr.forEach(item => {
                if (Array.isArray(item)) {
                    flat(item, depth - 1)
                } else {
                    result.push(item)
                }
            })
        })(arr, depth)
    return result
}

// stack
function flatten(arr) {
    const result = [];
    while (arr.length) {
        const next = arr.pop();
        if (Array.isArray(next)) {
            arr.push(...next)
        } else {
            result.push(next)
        }
    }
    return result.reverse()
}

// 递归
function flatten(arr) {
    const result = [];
    (function flat(arr) {
        arr.forEach(item => {
            if (Array.isArray(item)) flat(item)
            else result.push(item)
        })
    })(arr)
    return result
}

// 尾递归
function flatten(arr) {
    let result = [], dirty = false;
    arr.forEach(item => {
        if (Array.isArray(item)) {
            dirty = true;
            result.push(...item)
        } else {
            result.push(item)
        }
    })
    return dirty ? flatten(result) : result
}

// generator
function* flatten(arr) {
    for (let item of arr) {
        if (Array.isArray(item)) {
            yield* flatten(item)
        } else {
            yield item
        }
    }
}
let arr = [1, [2, [3, [4, [5, 6]]]]]
let flattened = [...flatten(arr)]

Array.prototype.find = function (cb, context) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while (k < len) {
        let val = O[k]
        if (cb.call(context, val, k, O)) {
            return val
        }
        k++
    }
    return undefined
}

Array.prototype.findIndex = function (cb, context) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while (k < len) {
        let val = O[k]
        if (cb.call(context, val, k, O)) {
            return k
        }
        k++
    }
    return -1
}
Array.fill = Array.prototype.fill = function (target) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    let O = Object(this), len = O.length >>> 0;
    let start = 0, end = len;
    if (arguments.length > 1) {
        start = arguments[1];
        if (isNaN(start)) {
            start = 0
        } else {
            start = Math.floor(len - Math.abs(start))
        }
    }
    if (arguments.length > 2) {
        end = arguments[2]
        if (!isNaN(end)) {
            end = Math.min(len, Math.floor(Math.abs(end)))
        }
    }

    while (start < end) {
        O[start] = target
        start++
    }
    return O
}

class Scheduler {
    constructor(max) {
        this.waits = []
        this.executors = []
        this.max = max
    }

    add(task) {
        if (this.executors.length < this.max) {
            this.run(task)
        } else {
            this.waits.push(task)
        }
    }

    run(task) {
        let len = this.executors.push(task)
        task().then(() => {
            this.executors.splice(len - 1, 1)
            if (this.waits.length > 0) {
                this.run(this.waits.shift())
            }
        })
    }
}

const timeout = (time) =>
    new Promise((resolve) => {
        setTimeout(resolve, time);
    });

const scheduler = new Scheduler();
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

Object.create = function (target, origin) {
    if (typeof target !== 'object' && typeof target !== 'function') {
        throw new TypeError('Object prototype may only be an Object or null')
    }
    if (origin === null) {
        throw new TypeError('Cannot convert undefined or null to object')
    }
    function F() { }
    F.prototype = target
    const obj = new F();
    if (origin !== undefined) {
        Object.defineProperty(obj, origin)
    }
    if (target === null) {
        obj.__proto__ = null
    }
    return obj
}

const isObject = obj => obj !== null && (typeof obj === 'object' || typeof obj === 'function');
const isFunction = obj => typeof obj === 'function';
function deepClone(obj, map = new WeakMap()) {
    if (map.has(obj)) {
        return map.get(obj)
    }
    if (!isObject(obj)) return obj;
    const constructor = obj.constructor;
    if (/^(Date|RegExp)$/.test(constructor.name)) {
        return new constructor(obj)
    }
    let result = new constructor()
    if (isFunction(obj)) {
        result = new Function('return ' + obj.toString())()
    }
    map.set(obj, result);
    [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].forEach(key => {
        result[key] = deepClone(obj[key], map)
    })
    return result
}

Array.prototype.reduce = function (cb, initVal) {
    if (this == null) {
        throw new TypeError('this is null or not defiend')
    }
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0;
    let k = 0, acc
    if (arguments.length > 1) {
        acc = initVal
    } else {
        while (k < len) {
            if (k in O) {
                acc = O[k++];
                break;
            }
            if (++k >= len) {
                throw new TypeError('Reduce of empty array width no initial value')
            }
        }
    }
    while (k < len) {
        if (k in O) {
            acc = cb(acc, O[k], k, O)
        }
    }
    return acc
}

function findCount(arr, target) {
    let start = arr.indexOf(target), end = arr.lastIndexOf(target);
    return end - start + 1
}
arr = [1, 2, 3, 3, 4, 5, 6]
console.log(findCount(arr, 3))

function findCount(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
            left = mid + 1
        } else if (arr[mid] > target) {
            right = mid - 1
        } else {
            left = mid;
            right = mid;
            break;
        }
    }
    console.log(left, right)
    while (left >= 1 && arr[left - 1] === target) left--;
    while (right >= 0 && (right + 1) < arr.length && arr[right + 1] === target) right++;
    return right - left + 1
}
arr = [1, 2, 3, 3, 4, 5, 6]
console.log(findCount(arr, 3))
let arr = ["A", "B", "C"]
// 1=>"A 4=>'AA'
let ch = (num) => {
  let m = num / arr.length,
    n = (num % arr.length) - 1,
    s = ""
  for (let i = 0; i < m; i++) {
    s += arr[n < 0 ? arr.length - 1 : n]
  }
  return s
}

console.log(ch(9), ch(1), ch(4))

function getUrlParam(sUrl, sKey) {
  let p = sUrl.split("?")[1].split("#")[0].split("&")
  let res = {}
  p.forEach((item) => {
    let o = item.split("=")
    res[o[0]] = res[o[0]] || []
    res[o[0]].push(o[1])
  })
  if (sKey) {
    return res[sKey] ? (res[sKey].length === 1 ? res[sKey][0] : res[sKey]) : ""
  } else {
    return res
  }
}

// 实现简单的模板字符串替换
var template = "{{name}}很厉害，才{{age}}岁"
function templateRender(template, data) {
  return template.replace(/{{(.*?)}}/g, function (macth, key) {
    return data[key]
  })
}
console.log(templateRender(template, { name: "tome", age: 23 }))

// 组出所有()可能的组合
function fn1(n) {
  let res = []
  function dfs(s, left, right) {
    if (left > n || left < right) return
    if (left + right === 2 * n) {
      res.push(s)
      return
    }
    dfs(s + "(", left + 1, right)
    dfs(s + ")", left, right + 1)
  }
  dfs("", 0, 0)
}

// 全排列
function fn2(arr) {
  let res = []
  if (arr.length === 0) {
    return res
  }
  let len = arr.length,
    used = {},
    path = []
  function dfs(depth) {
    if (depth === len) {
      res.push([...path])
      return
    }
    for (let i = 0; i < length; i++) {
      if (!used[i]) {
        path.push(arr[i])
        used[i] = true
        dfs(depth + 1)
        path.pop()
        used[i] = false
      }
    }
  }
  dfs(0)
  return res
}
arr = [
  ["a", "b"],
  ["1", "2", "3"],
  ["x", "y"]
]
function f(arr) {
  let result = [],
    len = arr.length
  function dfs(res) {
    if (res.length == len) {
      result.push(res.join(""))
      return
    }
    for (let i = 0; i < len; i++) {}
  }
}

arr = [1, 2, 3]
function fn(arr) {
  let res = [],
    len = arr.length,
    map = {}
  function dfs(r) {
    if (r.length === len) {
      res.push([...r])
      return
    }
    for (let i = 0; i < len; i++) {
      let p = arr[i]
      if (!map[i]) {
        map[i] = true
        r.push(p)
        dfs(r)
        map[i] = false
        r.pop()
      }
    }
  }
  dfs([])
  return res
}
console.log(fn([1, 2, 3]))

function fn1(len) {
  let res = []
  function dfs(r, left, right) {
    if (left > len || left < right) return
    if (left + right === 2 * len) {
      res.push(r)
      return
    }
    dfs(r + "(", left + 1, right)
    dfs(r + ")", left, right + 1)
  }
  dfs("", 0, 0)
  return res
}
console.log(fn1(3))

function curry(fn) {
  return function curried(...args) {
    if (args.length < fn.length) {
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
    return fn.apply(this, args)
  }
}
function sum(a, b, c) {
  return a + b + c
}

console.log(curry(sum)(1)(2)(3))

async function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

;(async function () {
  console.log(Date.now())
  await sleep(1000)
  console.log(Date.now())
})()

function toArray(list, start = 0) {
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

Array.prototype.forEach = function (cb, context) {
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), k = 0, len = O.length >>> 0;
    while(k < len){
        if(k in O){
            cb.call(context, O[k], k, O)
        }
        k++
    }
}
Array.prototype.reduce = function(cb, initVal){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0;
    if(arguments.length === 1 && len === 0){
        throw new TypeError('Reduce of empty array with no initial value')
    }
    let k = 0, acc;
    if(arguments.length >= 2){
        acc = initVal
    }else{
        // 稀疏数组
        do{
            if(k in O){
                acc = O[k++];
                break;
            }
            if(++k >= len ) throw new TypeError('Reduce of empty array with no initial value')
        }
        while(true)
    }
    while(k < len){
        if(k in O){
            acc = cb(acc, O[k], O)
        }
        k++
    }
    return acc
}
arr = [,,,3,4,5,,1]
arr.reduce((a, b) => a+b)

Array.prototype.reduce = function(cb, initVal){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0;
    if(arguments.length === 1 && len === 0) throw new TypeError('Reduce of empty array with no initial value')
    let acc, k = 0;
    if(arguments.length >= 2){
        acc = arguments[1]
    }else{
        while(true){
            if(k in O){
                acc = O[k++];
                break;
            }
            if(++k >= len) throw new TypeError('Reduce of empty array with no initial value')
        }
    }
    while(k < len){
        if(k in O){
            acc = cb.call(undefined, acc, O[k], k, O)
        }
        k++
    }
    return acc
}
arr = [,,,3,4,5,,1]
arr.reduce((a, b) => a+b)

Array.prototype.map = function(cb, context){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    let result = new Array(len);
    while(k < len){
        if(k in O){
            result[k] = cb.call(context, O[k], k, O)
        }
        k++
    }
    return result
}
console.log(arr.map(i => i*2))

Array.prototype.filter = function(cb, context){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    let result = [];
    while(k < len){
        if(k in O){
            let val = O[k]
            if(cb.call(context, val, k, O)){
                result.push(val)
            }
        }
        k++
    }
    return result
}
Array.prototype.find = function(cb, context){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while(k < len){
        let val = O[k]
        if(cb.call(context, val, k, O)){
            return val
        }
        k++
    }
    return undefined
}

Array.prototype.every = function(cb, context){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    while(k < len){
        if(k in O){
            if(!cb.call(context, O[k], k, O)){
                return false
            }
        }
        k++
    }
    return true        
}

Array.prototype.indexOf = function(target, start){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    if(len === 0) return -1
    if(isNaN(start)){
        start = 0
    }else if(start !==0 && start !== (1/0) && start !== -(1/0)){
        start = (start > 0 || -1)*Math.floor(Math.abs(start))
    }
    if(start > len) return -1
    var k = start >= 0? start : Math.max(len - Math.abs(start), 0);
    while(k < len){
        if(k in O && O[k] === target){
            return k
        }
        k++
    }
    return -1
}

Array.prototype.indexOf = function(target, start){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    let O = Object(this), len = O.length >>> 0, k = 0;
    if(len === 0) return -1;
    if(isNaN(start)){
        start = 0
    }else if(start !== 0 && start !== (1/0) && start !== -(1/0)){
        start = (start > 0 || -1) * Math.floor(Math.abs(start))
    }
    if(start > len) return -1
    k = start >= 0? start : Math.max(len - Math.abs(start), 0)
    while(k < len){
        if(k in O && O[k] === target){
            return k        
        }
        k++
    } 
    return -1
}
a = [,,,1,2,3,,,4]

Array.prototype.lastIndexOf = function(target, start){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    let O = Object(this), len = O.length >>> 0;
    if(len === 0) return -1
    start = len
    if(arguments.length > 1){
        start = Number(arguments[1])
        if(start !== start){
            start = 0
        }else if(start !== 0 && start !== (1/0) && start !== -(1/0)){
            start = (start > 0 | -1) * Math.floor(Math.abs(start))
        }
    }
    let k = start >= 0? Math.min(start, len - 1) : len - Math.abs(start)
    for(;k >=0; k--){
        if(k in O && O[k] === target){
            return k
        }
    }
    return -1
}

Array.prototype.indexOf = function(target, fromIndex){
    if(this == null){
        throw new TypeError('this i null or not defined')
    }
    let O = Object(this), len = O.length >>> 0;
    if(len === 0) return -1
    let n = +fromIndex || 0;
    if(Math.abs(n) === Infinity) n = 0;
    if(n >= len) return -1
    let k  = Math.max(n >= 0?n : len-Math.abs(n), 0);
    while(k < len){
        if(k in O && O[k] === target){
            return k
        }
        k++
    }
    return -1
}
Array.prototype.lastIndexOf = function(target, start){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    let O = Object(this), len = O.length >>> 0;
    if(len === 0) return -1;
    start = len
    if(arguments.length > 1){
        start = Number(arguments[1])
        if(start !== start){
            start = 0
        }else if(start !== 0 && start !== (1/0) && start !== -(1/0)){
            start = (start > 0 || -1) * Math.floor(Math.abs(start))
        }
    }
    let k = start >= 0? Math.min(start, len-1): len-Math.abs(start)
    for(; k >= 0; k--){
        if(k in O && O[k] === target){
            return k
        }
    }
    return -1
}

Array.prototype.some = function(cb, context){
    if(this == null){
        throw new TypeError('this is null or not defined')
    }
    if(typeof cb !== 'function'){
        throw new TypeError(cb + ' is not a function')
    }

}

let p = function(t){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(Math.random() > 0.5){
                resolve(t)
            }else{
                reject(t)
            }
        }, 1000)
    })
}

function multiRequest(urls, maxNum){
    let len = urls.length, count = 0;
    let result = new Array(len);
    return new Promise((resolve, reject) => {
        while(count < maxNum){
            next()
        }
        function next(){
            let current = count++;
            let promise = p(urls[current]);
            if(count >= len){
                resolve(result);
                return
            }
            promise.then(res => {
                console.log('成功', res, Date.now())
                result[current] = res;                
                if(current < len) next()
            }, err => {
                console.log('失败', err, Date.now())
                result[current] = err;
                if(current < len) next()
            })
        }
    })
}
