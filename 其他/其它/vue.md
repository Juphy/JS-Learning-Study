## Vue

### nextTick

由于 VUE 的数据驱动视图更新，是异步的，即修改数据的当下，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。

触发机制： 在同一事件循环中的数据变化后，DOM 完成更新，立即执行 nextTick(callback)内的回调。

```Vue
   <template>
    <div>
      <div ref="username">{{ username }}</div>
      <button @click="handleChangeName">click</button>
    </div>
  </template>
```

```JS
    export default {
    data () {
      return {
        username: 'PDK'
      }
    },
    methods: {
      handleChangeName () {
        this.username = '彭道宽'
        console.log(this.$refs.username.innerText) // PDK
      }
    }
  }
```
Vue.js在默认情况下，每次触发某个数据的setter方法后，对应的watcher对象其实会被push进一个队列queue中，在下一个tick的时候将这个队列queue全部拿出来run一遍。Vue异步执行DOM更新。只要观察到数据变化，Vue就将开启一个队列，并缓冲在同一个事件循环中发生的所有数据改变。如果同一个watcher被多次触发，只会被推到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作上非常重要。然后在下一次事件循环tick中，Vue刷新队列并执行实际工作。

Vue在修改数据的时候，不会立马就去修改数据。刷新队列时，组件会在事件循环队列清空时的下一个 tick 更新, 为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。

### Vue使用Proxy而不再用Object.defineProperty()
Object.defineProperty:
- 只能监听已有属性，无法追踪新增属性: 提供方法重新手动Observe,需要监听的话使用`Vue.set()`重新设置添加属性的响应式
- 需要深层遍历对象属性监听: 无法一次性监听对象所有属性，通过递归遍历调用来实现子属性响应式
- 无法响应数组操作: 通过遍历和重写Array数组原型方法操作方法实现，但是方法只限制在`push/pop/shify/unshift/splice/sort/reverse`,其它数组方法以及数组的使用则无法检测到，也无法监听数组索引的变化和长度的变更
- 拦截方法只有get/set
- 原型的属性需要单独监听

Object.defineProperty 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。
Vue 2.x 里,是通过 递归 + 遍历 data 对象来实现对数据的监控的,如果属性值也是对象那么需要深度遍历,
显然如果能劫持一个完整的对象是才是更好的选择。
Proxy 可以劫持整个对象,并返回一个新的对象。Proxy 不仅可以代理对象,还可以代理数组。还可以代理动态增加的属性。

Proxy的优势：
- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty:
- 兼容性好，支持IE9，而Proxy存在浏览器兼容性问题，而且无法用polyfill磨平