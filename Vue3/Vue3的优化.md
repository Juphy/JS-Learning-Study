### 源码优化
#### 更好的代码管理方式：monorepo
monorepo根据功能将不同的模块拆分到不同的package中，每个package有各自的API、类型定义和测试。
这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更明确。
另外一些package(reactivity)是独立于Vue.js使用的，这样如果用户想使用响应式能力，可以单独依赖这个响应式库
#### 有类型的JavaScript: TypeScript
### 性能优化
#### 源码体积优化
1. 移除一些冷门的feature(比如filter、inline-template等)
2. 引入`tree-shaking`减少打包的体积
`tree-shaking`依赖ES Module的静态结构，通过编译阶段的静态分析，找到没有引入的模块打上标记
然后再压缩阶段会利用uglify-js、terser等压缩工具真正地删除这些没有用到的代码
#### 数据劫持
Object.definedProperty必须预先知道劫持的key，这导致它并不能检测对象属性的添加和删除
Vue.$set和Vue.$delete.如果数据嵌套比较深，需要递归遍历数据。
Proxy劫持整个数据，可以检测到属性的增加和删除，深层的对象变化，在getter时递归响应式，
好处就是真正访问到的内部对象才会变成响应式，而不是无脑递归。
#### 编译优化
通过编译阶段对静态模块的分析，编译生成Block Tree，Block Tree是一个将模板基于动态节点指令切割的嵌套区块，
每个区块内部的节点结构是固定的，而且每个区块只需要以一个Array来追踪自身包含的动态节点。
借助Block Tree，Vue将vnode更新性能由于模块整体大小相关提升为与动态内容的数量相关。
Vue在编译阶段对Slot的编译优化、事件侦听函数的缓存优化、并且在运行时重写了diff算法。
### 语法API优化，Composition API
1. 优化组织逻辑
2. 优化逻辑复用
Vue2中通过mixins复用逻辑，当组件中混入大量的mixins的时候，会存在命名冲突和数据来源不清晰的问题,
利用hook函数，在组件中使用。
3. 引入RFC