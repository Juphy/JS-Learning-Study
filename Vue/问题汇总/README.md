### Vue-Router重复点击报错
*NavigationDuplicated: Avoided redundant navigation to current location*
```JS
// router/index
// 解决重复点击路由报错的BUG
const original = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return original.call(this, location).catch((err) => err)
}
```

