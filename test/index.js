// 防抖: 高频触发时，在指定的时间内，只响应最后一次
let debounce = function (cb, delay, immediate) {
    let timer;
    return function () {
        if (!timer && immediate) cb.apply(this, arguments);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb.apply(this, arguments)
        }, delay)
    }
}

// 节流: 高频触发时，在指定的时间内，只触发第一次
let throttle = function (cb, delay, immediate) {
    let timer, callNow = immediate;
    return function () {
        if (callNow) {
            cb.apply(this, arguments);
            callNow = false;
        }
        if (!timer) {
            timer = setTimeout(() => {
                cb.apply(this, arguments);
                timer = null;
            }, delay)
        }
    }
}

// 合并有序数组
// [1,3,5] [2,4]
let mergeArr = function (arr, brr) {
    let m = arr.length - 1, n = brr.length - 1, len = m + n + 1;
    while (n > -1) { // brr存在
        if (m < 0) { // arr不存在
            arr[len--] = brr[n--];
            continue;
        }
        arr[len--] = arr[m] > brr[n] ? arr[m--] : brr[n--];
    }
    return arr;
}

console.log(mergeArr([1, 3, 5], []))

// 内置[[Class]]
class Class1 { }
class Class2 {
    get [Symbol.toStringTag]() {
        return "Class2"
    }
}
console.log(Object.prototype.toString.call(Class1))
console.log(Object.prototype.toString.call(Class1))
console.log(Object.prototype.toString.call(new Class1()))
console.log(Object.prototype.toString.call(new Class2()))

function debounce1(cb, delay, immdeiate) {
  let timer;
  return function(){
    if(!timer&&immdeiate){
      cb.apply(this, arguments)
    }
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, arguments)
    }, delay)
  }    
}

function throttle1(cb, delay, immediate){
  let timer, callNow = immediate;
  return function(){
    if(callNow){
      cb.apply(this, arguments);
      callNow = false;
    }
    if(!timer){
      timer = setTimeout(() => {
        cb.apply(this, arguments);
        timer = null;
      }, delay)
    }
  }
}

function mergeArr1(arr, brr){
  let m = arr.length - 1, n = brr.length - 1, len = m + n + 1;
  while(n > -1){
    if(m < 0){
      arr[len--] = brr[n--];
      continue;
    }
    arr[len--] = arr[m] > brr[n]?arr[m--]:brr[n--]
  }
  return arr;
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

const scheduler = new Scheduler(2);
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
addTask(200, "5");
addTask(100, "6");
addTask(600, "7");
addTask(700, "8");