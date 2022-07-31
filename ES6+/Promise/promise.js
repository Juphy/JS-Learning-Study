const PENDING = "penidng"
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.resolvecbs = [];
    this.rejectcbs = [];
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.resolvecbs.forEach(cb => cb())
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.rejectcbs.forEach(cb => cb())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      let resolveTask = () => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      let rejectTask = () => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
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
        this.resolvecbs.push(resolveTask);
        this.rejectcbs.push(rejectTask);
      }
    })
    return promise2
  }

  cath(callback) {
    return this.then(null, callback)
  }

  finally(callback) {
    return this.then(
      value => Promise.resolve(callback()).then(() => value),
      err => Promise.resolve(callback()).then(() => { throw err })
    )
  }
}

function resolvePromise(promise2, x, resolve, reject){
  if(promise2 === x){
    return reject(new TypeError('Chaining detected cycle in promise'))
  }
  let called;
  if(x !== null && ( typeof x === 'object' || typeof x === 'function' )){
    try {
      let then = x.then;
      if(typeof then === 'function'){
        then.call(x, y => {
          if(called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject)
        }, e => {
          if(called) return;
          called = true;
          reject(e)
        })
      }else{
        resolve(x)
      }
    } catch (error) {
      if(called) return;
      called = true;
      reject(error)
    }
  }else{
    resolve(x)
  }
}

Promise.defer = Promise.deferred = function(){
  let obj = {};
  obj.promise = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  })
  return obj;
}
// let promisesaplustests = require('promises-aplus-tests');
// promisesaplustests(Promise, function(err){
//   console.log(err)
// })
let obj = {
  name: 'Tom',
  age: 24
}
Object.prototype.aaa = '123';
for(let key in obj){
  console.log(key)
}
if('aaa' in obj){
  console.log('123')
}