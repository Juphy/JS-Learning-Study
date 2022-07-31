## 过滤器

Vue.js 允许自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：
`双花括号插值`和`v-bind表达式`，过滤器应该被添加在 JavaScript 表达式的尾部，由”管道“符号指示:

```JS
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

> 可以在一个组件的选项中定义本地的过滤器

```JS
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

> 在创建 Vue 实例之前全局定义过滤器

```JS
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

_当全局过滤器和局部过滤器重名时，会采用局部过滤器。_

> 过滤器可以串联

```
{{ message | filterA | filterB }}
```

**过滤器是JavaScript函数，因此可以接收参数。**
```
{{ message | filterA('arg1', arg2) }}
```
`filterA`被定义为接收三个参数的过滤器函数，其中`message`的值作为第一个参数，普通字符串`arg1`作为第二个参数，表达式`arg2`的值作为第三个参数
