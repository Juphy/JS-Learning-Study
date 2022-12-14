### copy
`copy`函数可以让你在`console`里拿到任意的资源，甚至包括一些变量，在复制一些特别冗长的数据时特别有用，当复制完成后，直接使用`ctrl + v`即可。

`copy`接受一个变量作为参数，如果有多个参数，则忽略第一个后面的所有参数，当需要复制不存在变量名的数据时，可以配合`Store As Global`来使用。

### Store As Global
当我们从控制台获取一些数据却没有设置变量名时，可以通过右键点击数据旁的小三角形，通过其来存储为全局变量，变量名为`temp1`，然后即可以配合
copy获取变量名打印，该功能对HTML同样适用。


### $
- `$0~$4`可以获取点击的HTML元素，其中`$0`对应着最后一次点击的元素，`$1`次之，依序排列直到`$4`
- 作为选择器适用，分别是单`$`和双`$`，双`$`返回的并非`NodeList`而是一个纯正的数组
- `$_`获取上次执行结果的引用
- 安装`Console Importer`插件，`$i`就可以安装各种NPM库

### getEventListener
可以方便获取元素绑定的事件，特别是配合`$`使用，不过获取事件功能也可以在`Element`中查看，主要是当元素嵌套层级深且复杂时，
可以不用点击而通过选择器来查看元素。

### monitor
`DevTools`自带的监听器，简单的说明就是监听函数的函数，使用起来简单，直接套娃即可。

### Preserve Log
在调试页面时，经常遇到页面跳转或刷新的情况，此时打印的输出会被刷新掉，看不到想要的数据，这时需要勾选`Preserve Log`选项，就可以保存上一次打印的输出。

### inspect
`inspect`提供了一个可以快速跳转到DOM元素对应位置的方法，对于一些嵌套层级复杂或者未知的元素，可以通过`inspect`配合调试，将元素的选择器至传入函数中，
则会自动跳转到其对应位置。
```JS
inspect($('.class'))
```

### Layout
`Layout`是归属于元素面板的子面板，在其中可以查看元素的布局，特别是对于`flex&&grid`来说。
当用户点击一个使用`grid`布局的元素时，则会显示出其所有的小方格。如果想要知道更详细的信息。
比如每个格子所占的容量，宽度是多少，可以点击`Overlay display settings`下的选项来操作。

### Animations动画组
`More Tools`里面Animations能够捕捉所有当前在运作的动画组，并且修改其速度和耗时，在需要多个动画配合的时候非常好用，其由上至下分为4个区域：
- 最上方的区域可以清除所有捕捉的动画组，或者更改当前选定动画组的速度
- 第二行可以选择不同的动画组，此时下方面板将会更新为当前动画组的动画时间线
- 在中间拥有时间线的区域，可以理解为动画的进度条，可以通过拖动来跳跃到动画对应的时间点
- 在最下方的区域里，可以修改选定的动画
在使用动画组捕捉动画后，



