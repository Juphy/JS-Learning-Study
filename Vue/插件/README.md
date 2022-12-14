
## 插件
插件通常用来为Vue添加全局功能，插件的功能范围没有严格的限制：
1. 添加全局方法或者property
2. 添加全局资源：指令/过滤器/过渡等。如 vue-touch
3. 通过全局混入来添加一些组件选项。如 vue-router
4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

### 使用插件
通过全局方法`Vue.use()`使用插件，它需要在调用new Vue()启动之前完成：
```JS
// 调用 MyPlugin.install(Vue)
Vue.use(MyPlugin, { someOption: true })

new Vue({
    // ...组件选项
})
```
`Vue.use`会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。

Vue.js 官方提供的一些插件 (例如 vue-router) 在检测到 Vue 是可访问的全局变量时会自动调用 Vue.use()。
然而在像CommonJS这样的模块环境中，应该始终显式地调用`Vue.use()`
```JS
// 用 Browserify 或 webpack 提供的 CommonJS模块环境时
var Vue = require('vue')
var VueRouter = require('vue-router')

// 不要忘了调用此方法
Vue.use(VueRouter)
```

### 开发插件
Vue.js的插件应该暴露一个`install`方法。这个方法的第一个参数是`Vue`构造器，第二个参数是一个可选的选项对象
```JS
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```
