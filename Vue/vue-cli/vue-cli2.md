### 安装
> npm install -g vue-cli

### 初始化方案
#### webpack
 A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction.
 主要是用在vue的大型、正式专案，提供一个可以选择是否要加上以下列的工具，使用webpack并且附带各种工具：
 - 整合前端router(vue-router)
 - 对于CSS、JavaScript新旧版与跨浏览器问题（例如PostCSS 或者Babel）
 - 附带Coding Style（EsLint）与测试工具（unit test, E2E test）

> 使用方式
```JS
vue init webpack vue-webpack-demo
?Project name
?Project description
?Author
?Vue build(Use arrow keys)
> Runtime + Complier: recommended for most users
> Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - re
nder functions are required elsewhere
?Install vue-router?(Y/n)
?Use ESLint to lint your code?(Y/n)
?Pick an ESLint preset(Use arrow keys)
> Standard(https://github.com/standard/standard)
> Airbnb(https://github.com/airbnb/javascript)
> none(configure it yourself)
?Set up unit tests(Y/n)
> Jest
> Karma and Mocha
> none(configure it yourself)
?Setup e2e tests with Nightwatch?(Y/n)
?Should we run `npm install` for you after the project has been created? (recommended) (Use arrow keys)
> Yes, use NPM
> Yes, use Yarn
> No, I will handle that myself

   vue-cli · Generated "vue-webpack-demo".


# Installing project dependencies ...
# ========================
```
> Vue build的问题
1. Runtime + Compiler: recommended for most users 一般的选择
`build/ webpack.base.conf.js`
以下是使用`git diff`的差异结果：
```JS
module.exports = {
   //...
   resolve: {
     extensions: ['.js', '.vue', '.json'],
     alias: {
+      'vue$': 'vue/dist/vue.esm.js',
       '@': resolve('src'),
     }
   },
}

// src/main.js
 new Vue({
   el: '#app',
   router,
-  render: h => h(App)
+  components: { App },
+  template: '<App/>'
 })
```
2. Runtime-only: about 6KB lighter min+gzip,but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere
使用更接近编译器的模板替代方案：使用自订的渲染函数来初始化vue的root
```JS
render: function (createElement){
    return createElement(
        'h' \+ this.level, // tag name: h1~h6
        this.$slots.default // array of children
    )
}
```
关于渲染函数可以看[Render Function&JSX](https://vuejs.org/v2/guide/render-function.htm)

#### webpack-simple
A simple Webpack + vue-loader setup for quick prototyping.
主要用在vue与webpack整合在一起时，因为使用vue-loader可以使用.vue
vue+webpack的过渡环境。

#### browserify
A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.
- A full-featured Browserify
- vueify setup with hot-reload
- linting
- unit testing

> 使用方式
```JS
?Project name
?The version of the package (0.1.0)
?Project description (A Vue.js project)
?Author
? Vue build (Use arrow keys)
> Runtime + Compiler: recommended for most users
> Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - re
nder functions are required elsewhere
?Use ESLint to lint your code? (Y/n)
?Setup unit tests with Karma + Jasmine? (Y/n)
```

#### browserify-simple
A simple Browserify + vueify setup for quick prototyping.
使用browserify简化环境的选项
```JS
?Project name
?The version of the package (0.1.0)
?Project description (A Vue.js project)
?Author
```

#### PWA
PWA template for vue-cli based on the webpack template
用Vue写PWA
```JS
? Project name vue-pwa-demo
? Project short name: fewer than 12 characters to not be truncated on homescreens (default: same as name)
? Project description A Vue.js project
? Author
? Vue build (Use arrow keys)
> Runtime + Compiler: recommended for most users
> Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - re
nder functions are required elsewhere
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Setup unit tests with Karma + Mocha? Yes
? Setup e2e tests with Nightwatch? Yes
```

#### simple
The simplest possible Vue setup in a single HTML file.
```JS
? name vue-simple-demo
? author

   vue-cli · Generated "vue-simple-demo".
```
