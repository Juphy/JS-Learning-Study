### 修改视图
Vue通过数据绑定来修改视图，当某个数据被修改的时候，set方法会让闭包中的Dep调用notify通知所有订阅者wWtcher，
Watcher通过get方法执行vm._update(vm._render(), hydrating)。
```JS
Vue.prototype._update = function(vnode: VNode, hydrating?: boolean){
  const vm: Component = this;
  // 如果该组件已经挂载过了则代表进入这个步骤是个更新的过程，触发beforeUpdate钩子
  if(vm._isMounted){
      callHook(vm, 'beforeUpdate')
  }
  const prevEl = vm.$el
  const prevVnode    
}
```