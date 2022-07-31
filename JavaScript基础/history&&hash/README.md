### history
`window.history`是一个只读属性，用来获取`History`对象的引用，`History`对象提供了操作浏览器会话历史记录(浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面)的接口。
```JS
// 后退
window.history.back()
// 前进
window.history.forward()
// 跳转到history中指定的一个点
window.history.go(-1) // window.history.back()
window.history.go(1)  // window.history.forward()
```

#### 添加和修改历史记录中的条目
HTML5引入`history.pushState()`和`history.replaceState()`方法，分别可以添加和修改历史记录条目。
这些方法通常与`window.onpopstate`配合使用。
使用`history.pushState()`可以改变referrer，它在用户发送`XMLHttpRequest`请求时在HTTP头部使用，
改变state后创建的`XMLHttpRequest`对象的referrer都会被改变。因为referrer是标识创建`XMLHttpRequest`对象时`this`所代表的window对象中document的URL.

> pushState()

- 状态对象: state对象或者字符串，用来记录描述新纪录的一些特性
- 标题: 字符串, 当前可以忽略,传递空字符串
- URL: 定义新的历史URL记录。调用`pushState()`后浏览器并不会立即加载这个URL，但可能会在稍后某些情况下加载这个URL。
新的URL不是必须为绝对路径，如果新URL是相对路径，那么它将作为相对于当前URL处理。
新的URL必须与当前URL同源，否则`pushState()`会抛出一个异常，该参数可选，缺省为当前URL。

> replaceState()

与`history.pushState()`非常相似，区别在于`replaceState()`是修改了当前的历史记录而不是新建一个。
`replaceState()`的使用场景在于为了响应用户操作，如果想要更新状态对象或者当前历史记录的URL。

#### popstate事件
每当活动的历史记录项发生变化时， popstate 事件都会被传递给window对象。如果当前活动的历史记录项是被 pushState 创建的，或者是由 replaceState 改变的，那么 popstate 事件的状态属性 state 会包含一个当前历史记录状态对象的拷贝。

#### 获取当前状态
当页面加载时，可能会有个非null的状态对象。假设页面通过`pushState()`或者`replaceState()`方法设置了状态对象而后用户重启了浏览器，那么当页面重新加载时，页面会接收一个onload事件, 但没有popstate事件，如果读取`history.state`属性，将在`popstate`事件发生后得到这个state对象
读取当前历史记录项的状态对象state，为不必等待`popstate`事件.
调用pushState()或者replaceState()不会触发popstate事件，popstate事件只会在浏览器某些行为下触发，比如点击后退、前进按钮(或者history.back()、history.forward()、history.go()等方法)
```JS
window.addEventListener('load', () => {
    let currentState = history.state;
    console.log('currentState', currentState)
})
```

#### pushState与设置hash值
调用pushState()与设置window.location = '#foo'类似，两者都会在当前页面创建并激活新的历史记录。但pushState()具有以下优点:
1. 新的URL可以是与当前URL同源的任意URL，而window.location只是修改了哈希值才能保持同一文件
2. 如果需要，可以不必改变URL就能创建一条历史记录。而设置window.location.hash = '#foo'只有hash值不同的情况下，才会创建一个新的历史记录项。
3. 为新的历史记录项关联任意数据，而基于哈希值的方式，则必须将所有相关数据编码到一个短字符串里

### haschange
```JS
window.addEventListener('hashchange', function(){
    console.log('The hash has changed!')
}, false)

window.onhashchange = function(){
    if(location.hash === '#cool-feature'){
        console.log("You're visiting a cool feature")
    }
}
```


