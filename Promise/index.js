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
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err
          }
    let promise2 = new Promise((resolve, reject) => {
      let resolveTask = () => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      let rejectTask = () => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === FULFILLED) {
        resolveTask()
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
      (err) =>
        Promise.resolve(callback()).then(() => {
          throw err
        })
    )
  }

  static all(promises){
    return new Promise((resolve, reject) => {
      let arr = [], count = 0;
      promises.forEach((p, index) => {
        Promise.resolve(p).then(value => {
          arr[index] = value;
          count++;
          if(count === promises.length){
            resolve(arr);
          }
        }, reject)
      })
    })
  }

  static race(promises){
    return new Promise((resolve, reject) => {
      promises.forEach(p => {
        Promise.resolve(p).then(resolve, reject)
      })
    })
  }

  static allSettled(promises){
    return new Promise((resolve, reject) => {
      let arr = [], count = 0;
      promises.forEach((p, index) => {
        Promise.resolve(p).then(value => {
          arr[index] = {
            status: 'fulfilled',
            value
          }
          count++;
          if(count === promises.length) resolve(arr);
        }, reason => {
          arr[index] = {
            status: 'rejected',
            reason
          }
          count++;
          if(count === promises.length) resolve(arr)
        })
      })
    })
  }

  static any(promises){
    return new Promise((resolve, reject) => {
      let arr = [], count = 0;
      promises.forEach((p, index) => {
        Promise.resolve(p).then(resolve, reason => {
          arr[index] = reason;
          count++;
          if(count === promises.length) reject(new AggregateError('All promises were rejected'));
        })
      })
    })
  }

  static resolve(p){
    if(p instanceof Promise){
      return p
    }else{
      let then = p.then;
      if(typeof then === 'function'){
        return new Promise((resolve, reject) => {
          then.call(p, value => {
            resolve(value);
          })
        })
      }
    }
    return new Promise((resolve, reject)=> {
      resolve(p)
    })
  }

  static reject(p){
    return new Promise((resolve, reject) => {
      reject(p)
    })
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining dected cycle in promise!"))
  }
  let called
  if (x !== null && (typeof x === "function" || typeof x === "object")) {
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
          (e) => {
            if (called) return
            called = true
            reject(e)
          }
        )
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}


// Promise.deferred = Promise.defer = function(){
//   let obj = {};
//   obj.promise = new Promise((resolve, reject) => {
//     obj.resolve = resolve;
//     obj.reject = reject;
//   })
//   return obj;
// }
// let promiseAplueTest = require('promises-aplus-tests');
// promiseAplueTest(Promise, function(err){
//   console.log(err)
// })