const PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.resolvecbs = [];
    this.rejectcbs = [];

    let resolve = function (value) {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        while (this.resolvecbs.length) {
          this.rejectcbs.shift()(value)
        }
      }
    }

    let reject = function (err) {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = err;
        while (this.rejectcbs.length) {
          this.rejectcbs.shift()(err)
        }
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 解决 onFufilled，onRejected 没有传值的问题
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    // 因为错误的值要让后面访问到，所以这里也要抛出错误，不然会在之后 then 的 resolve 中捕
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    // 每次调用then都返回一个新的promise
    let promise2 = new Promise((resolve, reject) => {

      const resolveTask = () => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      const rejectTask = () => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === FULFILLED) {
        resolveTask();
      }

      if (this.status === REJECTED) {
        rejectTask();
      }

      if (this.status === PENDING) {
        this.resolvecbs.push(resolveTask)
        this.rejectcbs.forEach(rejectTask)
      }
    })
    return promise2
  }

  catch(callback) {
    return this.then(null, callback);
  }

  finally(callback) {
    return this.then(
      value => Promise.resolve(callback).then(() => value),
      err => Promise.resolve(callback).then(() => { throw err })
    )
  }

  static resolve(val) {
    if (val instanceof promise) return val;
    return new Promise((resolve, reject) => {
      resolve(val)
    })
  }

  static reject(val) {
    return new Promise((resolve, reject) => {
      reject(val)
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉promise
  // 循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 防止多次调用
  let called;
  if ((x !== null&&typeof x === 'object' || typeof x === 'function')) {
    try {
      // 为了判断resolve过的就不用再reject(比如reject和resolve同时调用的时候)
      let then = x.then;
      if (typeof then === 'function') { // 如果then是函数，就默认是promise
        // 不能直接x.then,直接then.call就可以了 因为x.then会再次取值
        // then执行，第一个参数是this, 后面是成功的回调和失败的回调
        then.call(x, y => {
          // 根据promise的状态决定是成功还是失败
          if (called) return;
          called = true;
          // 递归解析的过程(因为可能promise中还有promise)
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          // 只要失败就失败
          if (called) return;
          called = true;
          reject(r)
        })
      } else {
        // 如果x.then不是函数直接返回resolve作为结果
        resolve(x)
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    // 如果x不是函数或者对象
    resolve(x)
  }
}

Promise.resolve = function (val) {
  if (val instanceof Promise) return val;
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}

Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val)
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let i = 0, arr = new Array(promises.length);
    promises.forEach((p, index) => {
      Promise.resolve(p).then(val => {
        i++;
        arr[index] = valu;
        if (i === promises.length) resolve(arr)
      }, reject)
    })
  })
}

Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let i = 0, arr = new Array(promises.length);
    promises.forEach((p, index) => {
      Promise.resolve(p).then(val => {
        i++;
        arr[index] = {
          status: FULFILLED,
          value: val
        }
        if (i === promises.length) resolve(arr)
      }, err => {
        i++;
        arr[index] = {
          status: REJECTED,
          reason: err
        }
        if (i === promises.length) resolve(arr)
      })
    })
  })
}

Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let i = 0, arr = new Array(promises.length);
    promises.forEach((p, index) => {
      Promise.resolve(p).then(resolve, err => {
        i++;
        arr[index] = err;
        if (i === promises.length) {
          reject(new AggregateError('AggregateError: All promises were rejected'))
        }
      })
    })
  })
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

var promisesAplusTests = require("promises-aplus-tests");
promisesAplusTests(Promise, function (err) {
  console.log(err)
})