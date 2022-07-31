const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = void 0;
    this.reason = void 0;
    this.resolvecbs = [];
    this.rejectcbs = [];

    let resolve = function (value) {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.resolvecbs.forEach(cb => cb());
      }
    }

    let reject = function (err) {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = err;
        this.resolvecbs.forEach(cb => cb());
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}