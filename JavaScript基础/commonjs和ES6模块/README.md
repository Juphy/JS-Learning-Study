### commonJS
1. `require`用来加载某个模块
2. `module`代表当前模块，是一个对象，保存了当前模块信息。`exports`是`module`上的属性，保存了当前模块要导出的接口和变量，使用 require 加载的某个模块获取到的值就是那个模块使用 exports 导出的值
3. `module.exports`对象会作为`require`函数的返回值被加载。`require`的模块路径可以动态指定，支持传入一个表达式，也可以通过`if`语句判断是否加载了某个模块。

#### exports
每个模块都有一个exports私有变量，exports指向module.exports。exports是模块内部的私有变量，它只是指向module.exports,所以对exports直接赋值会导致exports不再指向module.exports。
```JS
var exports = modules.exports

const name = 'yang';
let ag = 29;
exports.name = name;
exports.getAge = function(){
    return age
}
```
#### require
- require基本功能是，读入并执行一个js文件，然后返回模块的exports对象。如果没有发现指定模块，会报错。
- 第一次加载模块时，会缓存该模块，后面再次加载时，就直接从缓冲中读取`module.exports`属性
- require导出的是值的浅拷贝，也就是说一旦导出一个值，模块内部的变化就影响不到这个值了