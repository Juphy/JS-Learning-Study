## 自定义指令

```JS
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

如果想要注册局部组件，组件中也可以接受一个`directives`的选项

```JS
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### 钩子函数

- `bind`: 只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置
- `inserted`: 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）
- `update`: 所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**，指令的值可能发生了变化，也可能没有
- `componentUpdated`: 指令所在组件的 VNode 及其子 VNode 全部更新后调用
- `unbind`: 只调用一次，指令与元素解绑时调用

### 钩子函数参数

- el: 指令所绑定的元素，可以用来直接操作 DOM
- binding: 一个对象，包含以下 property:
  - name: 指令名，不包含`v-`前缀
  - value: 指令的绑定值，例如: `v-my-directive="1 + 1"`中，绑定值为 2
  - oldValue: 指令绑定的前一个值，仅在`update`和`componentUpdated`钩子中可用。无论值是否改变都可用
  - expression: 字符串形式的指令表达式。例如: `v-my-directive="1 + 1"`中，表达式为`"1 + 1"`
  - arg: 传给指令的参数，可选。例如`v-my-directive:foo`中，参数为`"foo"`
  - modifiers: 一个包含修饰符的对象，例如: `v-my-directive.foo.bar`中，修饰符对象为`{ foo: true, bar: true }`
- vnode: Vue 编译生成的虚拟节点
- oldVnode: 上一个虚拟节点，仅在`update`和`componentUpdated`钩子中可用
  **除了`el`之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的`dataset`来进行**

### 动态指令参数

指令的参数可以是动态的。

```html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>
```

```JS
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    var s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})

new Vue({
  el: '#dynamicexample',
  data: function () {
    return {
      direction: 'left'
    }
  }
})
```

### 函数简写
`bind`和`update`时触发相同行为时，不关心其他的钩子：
```JS
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

### 对象字面量
如果指令需要多个值，可以传入一个JavaScript对象字面量
```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```
```JS
Vue.directive('demo', function(el, binding){
    console.log(binding.value.color)
    console.log(binding.value.text)
})
```
