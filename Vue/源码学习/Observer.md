### Observer

```JS
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 将Observer实例绑定到data的__ob__属性上
    // 在调用observe函数的时候会先检查是有已经有__ob__对象存放了Observer实例了，
    def(value, '__ob__', this) // Object.defineProperty()
    
    /** 
     * 如果是数组，将修改后可以截获响应的数组方法替换掉该数组的原型中的原生方法，达到监听数组数据变化响应的效果
     * 如果当前浏览器支持__proto__属性，则直接覆盖当前数组对象原型上的原生数组方法
     * 如果不支持该属性，则直接覆盖数组对象的原型
     * */
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value); // 数组遍历后再observe处理
    } else {
      this.walk(value); // 对象直接绑定
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  function protoAugment (target, src: Object) {
    target.__proto__ = src; // 修改原型上的方法
  }

  function copyAugment (target: Object, src: Object, keys: Array<string>) {
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      def(target, key, src[key]); // 直接修改数据的方法
    }
  }  
}
```
Observer类分析：
1. `value`数上据定义`__ob__`属性(不可枚举)为当前实例
2. 判断`value`是否是数组
- 是: `'__proto__' in {}`?
  - 是:`value.__proto__ = arrayMethods`
  - 否: 将`arrayMethods`上的`key`定义在`value`上(不可枚举)
  - 数组遍历，通过 observe 处理
- 否: `Object.keys(value)`遍历`value`上所有的 key，通过`defineReative`处理
如果是对象则进行深度遍历，为每一个子对象都绑定上方法，如果是数组则为每一个成员都绑定上方法。

`def`对象定义属性以及属性值
```JS
function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

`arrayMethods`是将数组中的一些方法单独处理成响应式。
如果在进行pop、push等操作的时候，push进去的对象根本没有进行过双向绑定，如果监听数组的变化？
只是修改了一些原生方法，还是没法做到修改下标或者修改数组的length来实现响应式
```JS
const arrayProto = Array.prototype // 获取原型
// 创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法
export const arrayMethods = Object.create(arrayProto)
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 重写数组方法，在保证不污染原生数组原型的情况下重写数组的这些方法，截获数组的成员发生的变化，
 * 执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理
 * 1.对新增数据进行响应式处理(push, unshift, splice)
 * 2.通知所有注册的观察者进行响应式处理
 * */
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methodsToPatch.forEach(function (method) {
  // cache original method
  // 缓存数组的原生方法，以便后面调用
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新插入的元素需要重新进行observe才能进行响应式
    if (inserted) ob.observeArray(inserted)
    // notify change  dep通知所有注册的观察者进行响应式处理
    ob.dep.notify()
    return result
  })
})
```


```JS
// 处理数组
function observeArray(items){
  for(let i = 0; i < items.length; i++){
    observe(items[i]);
  }
}
// 处理对象
function walk(value){
  Object.keys(value).forEach(key => defineReative(value, key))
}
```

### defineReactive
```JS
// 处理对象的类型的key和value
function defineReactive(obj, key, val){
  // 在闭包中定义一个dep对象
  const dep = new Dep(); /* 用于收集依赖 */
  /* 获取属性值的详细属性  writable属性值是否可变 configurable属性是否可删除 enumerable是否可枚举*/
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }
  // 获取get, set相关函数
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]; // 如果属性值不存在时，重新获取
  }

  let childOb = !shallow && observe(val); // 递归遍历，进行observe并返回子节点的observe对象
  OBject.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      const value = getter?getter.call(obj) : val; // 如果有getter函数,就使用getter计算的值

      /* 收集依赖等 */
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          // 子对象依赖收集，其实是将同一个watcher观察者实例放进两个depend中
          // 一个是正在本身闭包中的depend, 另一个是子元素的depend
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }

      return value
    },
    set: function(newVal){
      const value = getter?getter.call(obj) : val; // 旧值
      if (newVal === value || (newVal !== newVal && value !== value)) { // 值没变，或者新旧值为NaN
        return
      }
      // 如果setter函数存在就使用        
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childOb = !shallow && observe(newVal); // 遍历

      dep.notify(); /* 订阅者收到的信息回调 */
    }
  })
}
```
### observe
```JS
/**
 * 尝试创建一个Observer的实例，如果创建Observer实例成功则返回新的Observer实例，
 * 如果已有Observer实例则返回现有的Observer实例(通过__ob__)
 * */

function observe(object, asRootData){
  // 如果不是对象，或者虚拟dom的实例  
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__; // 如果原型上有observer
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 判断value的是对象而不是函数或者RegExp等才可以用来创建一个新的observer
    ob = new Observer(value)
  }
  // 如果是跟数据则计数
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob  
}
```
Vue的响应式数据都会有一个__ob__的属性作为标记，里面存放了该属性的观察器，也就是Observer的实例，防止重复绑定。

### Vue.set
```

```
