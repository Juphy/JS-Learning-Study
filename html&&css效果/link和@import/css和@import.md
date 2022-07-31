### link和@import
### 从属关系
`@import`是CSS提供的语法规则，只有导入样式表的作用
`link`是HTML提供的标签，不仅可以加载CSS文件，还可以定义RSS、rel连接属性

### 加载顺序
加载页面时，link标签引入的CSS被同时加载
`@import`引入的CSS将在页面加载完毕后被加载
在link中使用的@import会在页面加载完毕后才加载，在link中引入@import导入CSS文件可以看做是一种替换，
CSS解析引擎在对一个CSS文件进行解析时，如在顶部遇到`@import`,将被替换为该@import导入的CSS文件中的全部样式

### 兼容性区别
@import是CSS2.1才引入的语法，故只在IE5+才能识别
link是html的标签，不存在兼容性问题

### DOM可控性的区别
link可以通过操作DOM来动态插入link标签来改变样式

### 权重区别
link引入的样式权重大于@import引入的样式

在link标签引入的CSS文件中使用@import时，相同样式将被改CSS文件本身的样式层叠