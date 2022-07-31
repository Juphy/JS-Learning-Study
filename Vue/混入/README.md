### mixin
一个混入对象可以包含任意组件选项，当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项
```JS
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```
### 选项合并
1. 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先
2. 同名钩子函数将合并为一个数组，因此都被调用，混入对象的钩子将在组件自身钩子之前调用
3. 值为对象的选项，例如`methods`、`components`和`directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对


### 全局混入
一旦全局混入，将影响每一个之后创建的Vue实例
