### 为什么要依赖收集
```JS
new Vue({
  template:
    `<div>
      <span>text1:{{text1}}</span>        
      <span>text2:{{text2}}</span>        
    </div>`,
  data: {
      text1: 'text1',
      text2: 'text2',
      text3: 'text3'
  }  
})
```
text3在实际模板中并没有被用到，然而当text3的数据被修改（this.text3 = 'test'）的时候，同样会触发text3的setter导致重新执行渲染，这显然不正确。

### Dep

在对data上的对象进行修改值得时候会触发它的setter,那么在取值的时候自然就会触发gette事件，
所以只要在最开始进行一次render,那么所有被渲染所依赖的data中的数据就会被getter时收集到Dep的subs中。
在对数据进行修改的时候setter就会触发Dep的subs的函数。
```JS
class Dep{
  static target?: Watcher;
  id: number;
  subs: Array<Watcher>;
  
  constructor(){
    this.id = uid++;
    this.subs = [];
  }

  addsub(sub: Watcher){
    this.subs.push(sub)
  }

  removesub(sub: Watcher){
    remove(this.subs, sub)    
  }

  // 依赖收集，当存在Dep.target的时候添加观察者对象
  depend(){
    if(Dep.target){
      Dep.target.addDep(this)    
    }  
  }

  // 通知所有订阅者
  notify(){
    const subs = this.subs.slice();
    for(let i = 0;i<subs.length;i++){
      subs[i].update()  
    }  
  }
}

function remove(arr, item){
  if(arr.length){
    let index = arr.indexOf(item);
    if(index > -1){
      return arr.splice(index, 1)
    }
  }
}

// 记录当前的watcher
Dep.target = null; // 依赖收集完需要将Dep.target设为null,防止后面重复添加依赖
const targetStack = [];
function pushTarget(target?: Watcher){
  targetStack.push(target);
  Dep.target = target;  
}
function popTarget(){
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];  
}
```

### Watcher
订阅者，当依赖收集的时候会通过addsub将watcher(即当前的Dep.target)添加到subs,
在修改data中的数据时候会触发dep对象的notify,通知所有Watcher对象去修改对应的视图。
```JS
class Watcher{
  constructor(
    vm: Component, 
    expOrFn: string | Function, 
    cb: Function, 
    options?: Object, 
    isRenderWatcher){
    this.vm = vm;
    // 将vm实例上的watcher指定为当前watcher实例
    if(isRenderWatcher){
      vm._watcher = this;  
    }
    // _watchers存放订阅者实例    
    vm._watchers.push(this);

    // options
    if(options){
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before     
    }else{
      this.deep = this.user = this.lazy = this.sync = false    
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''    
    // parse expression for getter
    // 把表达式expOrFn解析成getter
    if(typeof expOrFn === 'function'){
      this.getter = expOrFn;    
    }else{
      this.getter = parsePath(expOrFn)
      if(!this.getter){
        this.getter = noop;
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )            
      }  
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  }
  
  // 运行getter,重新收集依赖
  get(){
    // Dep.target = this, 在这里将观察者本身赋值给全局的target, 只有被target标记过的才会进行依赖收集    
    pushTarget(this)
    let value
    const vm = this.vm
    // 执行getter操作，看似执行了渲染操作，其实执行了依赖收集
    // 在将Dep.target设置为自身观察者实例后，执行getter操作
    /**
     * 现在data中有a、b、c三个数据，getter渲染需要依赖a跟c，
     * 那么在执行getter的时候就会触发a跟c两个数据的getter函数，
     * 在getter函数中即可判断Dep.target是否存在然后完成依赖收集
     * 将该观察者对象放入闭包中的Dep的subs中
     *  */
    try {
      value = this.getter.call(vm, vm) // 触发渲染操作进行依赖收集
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      // 如果deep是true，则触发每个深层对象的依赖，追踪其变化
      if (this.deep) {
        // 递归每一个对象或者数组，触发它们的getter,使得对象或数组的每一个成员都被依赖收集，形成一个深(deep)依赖关系
        traverse(value)
      }
      // 将观察者实例从target栈中取出并设置给Dep.target
      popTarget()
      this.cleanupDeps()
    }
    return value      
  }
  
  // 添加一个依赖关系到Deps集合中
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  
  // 清理依赖收集
  cleanupDeps () {
    let i = this.deps.length
    // 移除所有观察者对象
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  
  // 调度者接口，当依赖发生变化的时候进行回调
  update(){
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      // 同步则执行run直接渲染视图
      this.run()
    } else {
      // 异步推送到观察者队列中，由调度者调用
      queueWatcher(this)
    } 
  }

  // 调度者工作接口，将被调度者回调
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        // 即便值相同，拥有Deep属性的观察者以及在对象或数组上的观察者应该被触发更新，因为它们的值可能发生了改变
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value // 设置新的值

        // 触发回调渲染视图
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  // 获取观察者的值
  evaluate(){
    this.value = this.get();
    this.dirty = false;
  }

  // 收集该watcher的所有deps依赖
  depend(){
    let i = this.deps.length;
    while(i--){
      this.deps[i].depend()
    }
  }

  // 将自身从所有依赖收集订阅者列表删除
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```

### 收集依赖
将观察者Watcher实例赋值给全局的Dep.target，然后触发render操作只有被Dep.target标记过的才会进行依赖收集。有Dep.target的对象会将Watcher的实例push到subs中，在对象被修改触发setter操作的时候dep会调用subs中的Watcher实例的update方法进行渲染。
```JS
class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data, options.render);
        let watcher = new Watcher(this, );
    }
}

function defineReactive (obj, key, val, cb) {
    /*在闭包内存储一个Dep对象*/
    const dep = new Dep();

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: ()=>{
            if (Dep.target) {
                /*Watcher对象存在全局的Dep.target中*/
                dep.addSub(Dep.target);
            }
        },
        set:newVal=> {
            /*只有之前addSub中的函数才会触发*/
            dep.notify();
        }
    })
}

Dep.target = null;
```