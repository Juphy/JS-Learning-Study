const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.resolvecbs = []
    this.rejectcbs = []

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.resolvecbs.forEach((cb) => cb())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.rejectcbs.forEach((cb) => cb())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected = typeof onRejected === "function" ? onRejected : (err) => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      const resolveTask = () => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      const rejectTask = () => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
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
        rejectTask()
      }
      if (this.status === PENDING) {
        this.resolvecbs.push(resolveTask)
        this.rejectcbs.push(rejectTask)
      }
    })
    return promise2
  }

  catch(callback) {
    return this.then(null, callback)
  }

  finally(callback) {
    return this.then(
      (value) => Promise.resolve(callback()).then(() => value),
      (reason) =>
        Promise.resolve(callback()).then(() => {
          throw reason
        })
    )
  }

  static resolve(p) {
    if (p instanceof Promise) return p
    return new Promise((resolve, reject) => {
      resolve(p)
    })
  }

  static reject(p) {
    return new Promise((resolve, reject) => {
      reject(p)
    })
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      let i = 0,
        arr = new Array(promises.length)
      promises.forEach((p, index) => {
        Promise.resolve(p).then((val) => {
          i++
          arr[index] = val
          if (i === promises.length) resolve(arr)
        }, reject)
      })
    })
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((p) => {
        Promise.resolve(p).then(resolve, reject)
      })
    })
  }

  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      let i = 0,
        arr = new Array(promises.length)
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          (value) => {
            i++
            arr[index] = {
              status: FULFILLED,
              value
            }
            if (i === promises.length) resolve(arr)
          },
          (reason) => {
            i++
            arr[index] = {
              status: REJECTED,
              reason
            }
            if (i === promises.length) resolve(arr)
          }
        )
      })
    })
  }

  static any(promises) {
    return new Promise((resolve, reject) => {
      let i = 0,
        arr = new Array(promises.length)
      promises.forEach((p, index) => {
        Promise.resolve(p).then(resolve, (reason) => {
          i++
          arr[index] = reason
          if (i === promises.length)
            reject("AggregateError: All promises were rejected")
        })
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"))
  }
  let called;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (err) => {
            if (called) return
            called = true
            reject(err)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

// Promise.deferred = Promise.defer = function () {
//   let obj = {}
//   obj.promise = new Promise((resolve, reject) => {
//     obj.resolve = resolve
//     obj.reject = reject
//   })
//   return obj
// }
// let promiseAPlusTest = require("promises-aplus-tests")
// promiseAPlusTest(Promise, function (err) {
//   console.log(err)
// })

Promise.resolve().then(res => {
  console.log(7)
  return Promise.resolve(8)
}).then((e) => {
  console.log(e)
}).then(() => {
  console.log(9)
}).then(() => {
  console.log(10)
}).then(() => {
  console.log(11)
})

new Promise((resolve, reject) => {
  console.log(1);
  resolve(2)
}).then((e) => {
  console.log(e)
}).then(() => {
  console.log(3)
}).then(() => {
  console.log(12)
}).then(() => {
  console.log(13)
}).then(() => {
  console.log(14)
})

new Promise(async (resolve, reject) => {
  console.log(4)
  let a = await Promise.resolve(5);
  resolve(a)
}).then(e => {
  console.log(e)
}).then(() => {
  console.log(6)
}).then(() => {
  console.log(15)
}).then(() => {
  console.log(16)
})

// 1 4 7 2 5 3 6 8

Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})
// 0 1 2 3 4 5 6

