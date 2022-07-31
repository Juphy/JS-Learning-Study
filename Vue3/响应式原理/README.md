响应式实现源码：[vue-3-reactivity](https://github.com/Code-Pop/vue-3-reactivity)

### 单个数据响应式
1. 初始化一个Set类型的dep变量，用来存放需要执行的副作用(effect函数)
2. 创建track函数，用来将需要执行的副作用保存到dep变量中(收集副作用)
3. 创建trigger()函数，用来执行dep变量中的所有副作用函数
每次修改响应式数据时，调用trigger函数执行所有副作用函数


### ref
在`ref.js`的实现中，如果将`total`的副作用函数先于`salePrice`
```JS
effect(() => {
  total = salePrice.value * product.quantity
})
effect(() => {
  salePrice.value = product.price * 0.9
})
```
将会导致`RangeError: Maximum call stack size exceeded`
此时，有两种处理方式：
1. 修改`ref`
```JS
const ref = raw => {
    const r = {
        get value(){
            track(r, 'value')
            return raw
        },
        set Value(newVal){
            if(newVal !== raw){
                raw = newVal
                trigger(r, 'value')
            }
        }
    }
    return r
}
```
2. 修改`trigger`
```JS
const trigger = (target, key) => {
    let depsMap = targetMap.get(target)
    if(!depsMap) return
    let dep = depsMap.get(key)
    if(dep){
        dep.forEach(innerEffect => {
            effect(innerEffect)
        })
    }
}
```