function fn1(n) {
  let res = [];
  function dfs(s, left, right) {
    if (left > n || left < right) return;
    if (left + right === 2 * n) {
      res.push(s);
      return;
    }
    dfs(s + '(', left + 1, right);
    dfs(s + ')', left, right + 1);
  }
  dfs('', 0, 0)
  return res;
}
console.log(fn1(3))
function fn2(arr) {
  let res = [];
  let len = arr.length, used = {};
  function dfs(a) {
    if (a.length === len) {
      res.push([...a]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      let value = arr[i];
      if (!used[value]) {
        a.push(value);
        used[value] = true;
        dfs(a);
        a.pop();
        used[value] = false;
      }
    }
  }
  dfs([])
  return res;
}
console.log(fn2([1, 2, 3]))
function unique(arr) {
  return arr.filter((a, i, array) => array.indexOf(a) === i)
}
console.log(flatten([1, 1, 2, 2, 3, 3, 4]))
function unique(arr) {
  return [...new Set(arr)]
}


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
console.log(flatten([1, [2, [3, [4, 5, [6]]]]]))
function flatten(arr) {
  while (arr.find(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
console.log(flatten([1, [2, [3, [4, 5, [6]]]]]))

function deepClone(data) {
  if (typeof data !== 'object') return data;
  let res = data instanceof Array ? [] : {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      res[key] = typeof data[key] === 'object' ? deepClone(data[key]) : data[key]
    }
  }
  return res;
}

(function () {
  let F = function () { };
  return function (target, origin) {
    F.prototype = origin.prototype;
    target.prototype = new F();
    target.prototype.constructor = target;
    target.prototype.uber = origin.prototype;
  }
})()


let isObject = function (data) {
  return data !== null && (typeof data === 'object' || typeof data === 'function');
}

function deepClone(target, map = new Map()) {
  if (map.get(target)) {
    return target
  }
  let constructor = target.constructor;
  if (/^(ExpReg | Date)$/.test(constructor.name)) {
    return new constructor(target)
  }
  if (isObject(target)) {
    map.set(target, true);
    if (typeof target === 'function') {
      return new Function('return ' + target.toString())()
    } else {
      let res = Array.isArray(target) ? [] : {};
      for (let key in target) {
        if (target.hasOwnProperty(key)) {
          res[key] = deepClone(target[key], map)
        }
      }
      return res;
    }
  } else {
    return target
  }
}
function fn() {
  console.log(123)
}
console.log(fn)
console.log(deepClone(fn))

class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(event, fn) {
    if (this.events[event]) {
      this.events.push(fn)
    } else {
      this.events[event] = [fn]
    }
  }
  off(event, fn) {
    let fns = this.events[event];
    if (fns) {
      let index = fns.findIndex(f => f === fn || f.callbak === fn);
      if (index >= 0) {
        fns.splice(index, 1)
      }
    }
  }
  emit(event, once = false, ...args) {
    if (this.events[event]) {
      let fns = this.events[event];
      for (let fn of fns) {
        fn(...args)
      }
      if (once) delete this.events[event]
    }
  }
}

function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1];
  const paramsArr = paramsStr.split('&');
  let paramsObj = {};
  paramsArr.forEach(param => {
    if (param.includes('=')) {
      let [key, value] = param.split('=');
      value = encodeURIComponent(value);
      if (/^\d+(\.?)(\d+?)$/.test(value)) value = parseFloat(value);
      if (paramsObj.hasOwnProperty(key)) {
        paramsObj = [].concat(paramsObj[key], key)
      } else {
        paramsObj[key] = value;
      }
    } else {
      paramsObj[param] = true
    }
  })
  return paramsObj;
}

function templateRender(template, data) {
  return template.replace(/{{(.+?)}}/g, function (match, key) {
    return data[key]
  })
}
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let person = {
  name: '布兰',
  age: 12
}
console.log(templateRender(template, person))

// 图片懒加载
// let imgList = Array.from(document.querySelectorAll('img'));
// let len = imgList.length;
// let imgLazyLoad = (function () {
//   let count = 0;
//   return function () {
//     let deleteIndexList = [];
//     imgList.forEach((img, index) => {
//       let rect = img.getBoundingClientRect();
//       if (rect.top < window.innerHeight) {
//         img.src = img.dataset.src;
//         deleteIndexList.push(index)
//         count++;
//         if (count === len) {
//           document.removeEventListener('scroll', imgLazyLoad);
//         }
//       }
//     })
//     imgList = imgList.filter((img, index) => !deleteIndexList.includes(index))
//   }
// })();
// document.addEventListener('scroll', imgLazyLoad)

// 

let sleep = async function(delay){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay)
    })
}


;(async function(){
    console.log(Date.now());
    await sleep(1000);
    console.log(Date.now());
})()
