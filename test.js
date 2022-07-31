let debounce = function (cb, delay, flag) {
  let timer;
  return function () {
    if (flag && !timer) {
      cb.apply(this, arguments)
    }
    if (timer) clearTimeout(timer);
    timer = SetTimeout(() => {
      cb.apply(this, arguments);
    }, delay)
  }
}

let throttle = function (cb, delay, flag) {
  let timer, callNow = flag;
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

let reverse = function (head) {
  let prev = null,
    cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

let inherit = (function () {
  let F = function () {};
  return function (target, origin) {
    F.prototype = origin.prototype;
    target.prototype = new F();
    target.prototype.constructor = target;
    target.prototype.uber = origin.prototype;
  }
})()

let build = function (Fn, ...rest) {
  let res1 = Object.create(Fn.prototype),
    res2 = Fn.apply(res1, rest);
  if (res2 !== null && (typeof res2 === 'object' || typeof res2 === 'function')) {
    return res2;
  }
  return res1;
}

Function.prototype.bind = function () {
  let that = this,
    args = Array.prototype.slice.call(arguments, 1);
  return function () {
    that.apply(context, args);
  }
}

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = arr.splice(Math.floor(arr.length / 2), 1)[0];
  let left = [],
    right = [];
}
inherit = (function(){
    let F = function(){};
    return function(target, origin){
        F.prototype = origin.prototype;
        target.prototype = new F();
        target.prototype.constructor = target;
        target.prototype.uber = origin.prototype;
    }
})()

debounce = function(cb, delay, immediate){
    let timer;
    return function(){
        if(!timer&&immediate){
            cb.apply(this, arguments)
        }
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb.apply(this, arguments)
        }, delay)
    }
}

throttle = function(cb, delay, immediate){
    let timer, callNow = immediate;
    return function(){
        if(callNow){
            cb.apply(this, arguments);
            callNow = false;
        }
        if(!timer){
            timer = setTimeout(function () {
                cb.apply(this, arguments);
                timer = null;
            }, delay)
        }
    }
}
;(function(){
    let targetMap = new WeakMap()
    let activeEffect = null
    let effect = eff => {
        activeEffect = eff
        activeEffect()
        activeEffect = null
    }
    function track(target, key){
        if(activeEffect){
            let depsMap = targetMap.get(target)
            if(!depsMap){
                targetMap.set(target, (depsMap = new Map()))
            }
            let dep = depsMap.get(key)
            if(!dep){
                depsMap.set(key, (dep = new Set()))
            }
            dep.add(activeEffect)
        }
    }
    function trigger(target, key){
        let depsMap = targetMap.get(target)
        if(!depsMap) return
        let dep = depsMap.get(key)
        if(dep){
            dep.forEach(effect => {
                effect()
            })
        }
    }
    const ref = raw => {
        const r = {
            get value(){
                track(r, 'value')
                return raw
            },
            set Value(newVal){
                if(raw!==newVal){
                    raw = newVal                    
                    trigger(r, 'value')
                }
            }
        }
        return r
    }
    const computed = (getter) => {
        let result = ref()
        effect(() => result.value = getter())
        return result
    }

    const reactive = (target) => {
        const handler = {
            get(target, key, receiver){
                let result = Reflect.get(target, key, receiver)
                track(target, key)
                return result
            },
            set(target, key, value, receiver){
                let oldValue = target[key]
                let result = Reflect.set(target, key, value, receiver)
                if(oldValue !== value){
                    trigger(target, key)
                }
                return result
            }
        }
        return new Proxy(target, handler)
    }
})()
;(function(){
    function deepCopy(target, map = new WeakMap()){
        if(map.has(target)){
            return map.get(target)
        }
        if(typeof target !== null && (typeof target === 'object' || typeof target === 'function')){
            let constructor = target.constructor
            if(/^(Date | RegExp)$/.test(constructor.name)){
                return new constructor(target)
            }
            let res = new constructor()
            if(typeof target === 'function'){
                res = new Function('return '+target.toString())
            }
            map.set(target, res)
            [...Object.ge]
        }else{
            return target
        }
    }
})()