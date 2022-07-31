### 页面停留时间
Time on Page简称Tp，用于反映用户在某些页面上停留时间的长短.

### 分析
页面的生命周期抽象为三个动作: `进入`，`活跃状态切换`，`离开`
|动作|触发行为|
|:--|:--|
|进入|首次加载、页面跳转、刷新、浏览器前进后退|
|活跃状态切换|页面失去焦点/获得焦点、切换窗口最小化、切换浏览器tab、电脑睡眠和唤醒|
|离开|关闭窗口、页面跳转、刷新、浏览器前进后退|

### 监听页面的进入和离开
常规页面的首次加载、页面关闭、刷新、等操作都可以通过`window.onload`和`window.onbeforeunload`事件来监听页面进入和离开
浏览器的前进和后退可以通过`pageshow`和`pagehide`处理。

### 单页面应用
内部的跳转可以转化为两个问题：1.监听路由变化 2.判断变化的URL是否为不同页面
主流的单页面应用大部分都是基于BrowserHistory(history api)或者hashHistory来做路由处理，通过监听路由变化来判断页面是否有可能切换。
注意是有可能`切换`,因为URL发生变化不代表页面一定切换，具体的路由配置是由业务决定的。

#### BrowserHistory
路由变化的本质都会调用`History.pushState()`或`History.replaceState()`.
`popState`事件只会在浏览器前进后退的时候触发(调用`history.back()`或者`history.forward()`)
当调用`history.pushState()`或者`history.replaceState()`的时候并不触发。
重写`history.pushState`和`history.replaceState`方法不会触发`popstate`事件
```JS
let wr = function(type){
  let origin = window.history[type];
  return function(){
      let value = origin.apply(this, arguments);
      let e = new Event(type.toLowerCase());
      e.arguments = arguments;
      window.dispatchEvent(e);
      return value;
  }
}
window.history.pushState = wr('pushState');
window.history.replaceState = wr('replaceState');
```
### HashHistory
`hashHistory`的实现是基于hash的变化，hash的变化可以通过`hashchange`来监听

### 监听页面活跃状态切换
`page Visibility API`和window上声明`onblur`/`onfocus`事件来处理
```JS
document.addEventListener('visibilitychange',  function (event) {
  console.log(document.hidden, document.visibilityState)
})
```
### 数据上报的时机
1. 页面离开时上报: 页面刷新或者关闭窗口等操作可能会造成数据丢失
2. 下次打开页面时上报: 会丢失历史访问记录中最后一个页面数据
采用2方案在页面离开时，将数据存储在localStorage中，当用户下次进入页面的时候会把暂存的数据上报。
如果用户下次打开页面是第二天，对于统计当天的活跃时长有一定的误差，因此上报的数据中需要带上页面进入/离开的时间戳