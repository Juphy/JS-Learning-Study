import { def } from '../util/index'
let arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsTpPatch = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'sort',
  'reverse'
];

methodsTpPatch.forEach(function (method) {
  let originnal = arrayMethods[method];
  def(arrayMethods, method, function(...args){
    let result = originnal.apply(this, args)
    let ob = this.__ob__;
    let inserted
    switch (method) {
      case push:
      case unshift:
        inserted = args  
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
    }
    if(inserted) ob.observerArray(inserted)
    ob.dep.notify()
    return result
  })
})