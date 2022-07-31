### Angular的zone.js
zone.js 就是一个代码改写拦截器，通过拦截方法捕捉内部信息，大家知道javascript的方法是可以任意被改写的，也就是说如果你在全局定义了一个setTimeout就可以改写掉原来的setTimeout。
为什么要做拦截改写，因为我们希望在setTimeout后能而外的捕捉到这个异步方法的一些信息，或执行而外的操作。

### Angular如何编译component
Angular的编译器会把component编译成 component view，component view中包含有【创建view】和【change detection】 2部分代码。

### Angular是如何做响应式变化
Angular应用内部在创建每一个组件实例的同时，也会创建一个对应的检测器实例，用来记录组件的数据变化状态，所以在应用形式组件树的同时，也形成了检测器实例的树型结构。

任何的响应式变化都是通过异步完成的，包括按钮的点击事件onclick，http请求，setTimeout，Angular通过zone.js对方法拦截后会触发Change Detection。

### Angular变更检测的周期
- 开发人员更新数据模型，例如通过更新组件绑定
- angular 检测变化
- 变更检测从上到下检查组件树中的每个组件，以查看相应的模型是否已更改
- 如果有新值，它将更新组件的视图（DOM）

Angular使用Zone.js跟踪拦截异步任务。当发生任何用户事件，计时器，XHR，promise等， 回调会触发检测。

Angular提供了两种策略来运行更改检测：
- Default（从上到下检查组件树中的每个组件）
- OnPush （当输入属性已更改/该组件或其子组件触发事件处理/通过异步管道链接到模板的可观察对象发出新值， 如 data | async/手动触发时触发检测。 当settimeout, setInterval, Promise.resolve().then(),this.http.get('..').subscribe()不会触发变更检测）
    - 组件的@Input属性的引用发生变化
    - 组件内的事件，比如onClick、onMouseDown
    - 组件内的Observable订阅事件，同时设置Async pipe
    - 组件内手动使用ChangeDetectorRef.detectChanges()，ChangeDetectorRef.markForCheck()，ApplicationRef.tick()方法
