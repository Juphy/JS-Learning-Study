#### 原始类型
string number boolean bigInt symbol

#### 数组
number[] Array`<`number`>`

#### any
noImpliciAny 开启后当隐式推断为`any`时, TypeScript就会报错

#### 对象类型
可选属性

#### 联合类型
`|`增加了类型，收窄了属性。

#### 类型别名
一个可以指代任意类型的名字。别名是唯一的别名。
不能使用类型别名创建同一个类型的不同版本。

#### interface

#### 类型别名和接口
相同点：1,对象和函数类型 2,都可以扩展(接口extends,类型别名&交集)
不同点：1,范围不同(类型别名可以为任意的类型创建类型别名，接口声明右边必须是变量结构)
2,不同的扩展形式(接口扩展是会检查是否可以扩展，不能重复，类型别名不会，会产生never情况)
3,不同的重复定义形式(接口可以重复定义，多次声明自动合并，类型别名不会)

#### 类型断言
类型断言将一个类型转换成一个更加具体或者更不具体的类型。
as `<`Type`>`

#### 字面量类型
将类型声明为更具体的数字或者字符串。
字面量类型结合联合类型，字面量类型也可以结合非字面量类型。
类型`boolean`实际就是联合类型`true | false`的别名。 

#### 字面量推断
当初始化变量为一个对象的时候，typescript会假设这个对象的属性的值未来会被修改。

- 一个类型断言改变推断结果
- `as const`把整个对象转为一个类型字面量

#### null和undefined
原始类型的值，用于表示空缺或者未初始化。
strictNullChecks 关闭时，如果一个值是`null`或者`undefined`，
依然可以被正确的访问，或者被赋值给任意类型的属性。
strictNullChecks 开启时，需要在用它的方法或者属性之前，先检查这些值。

#### 非空断言!
可以在不做任何检查的情况下，从类型中移除`null`和`undefined`，在任意表达式后面写上`!`,
这是一个有效的类型断言，表示它的值不可能是`null`或者`undefiend`
```TS
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 类型收窄
TypeScript 要学着分析这些使用了静态类型的值在运行时的具体类型。
```TS
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return new Array(padding + 1).join(" ") + input;
  }
  return padding + input;
}
```
在`if`语句中，TypeScript会认为`typeof padding === 'number'`是一种特殊形式的代码。
称之为**类型保护**。
TypeScript的类型检查器会考虑到这些类型保护和赋值语句，
而这个将类型推导为更为精准类型的过程。称之为收窄。
#### typeof类型保护
检查`typeof`能识别js中一些怪异的地方，
#### 真值收窄
通过隐式类型转换或者!检查真值
#### 等值收窄
=== !== == !=
#### in
判断一个对象是否有对象的属性名
#### instanceof
#### 赋值语句
#### 类型判断式 is
#### 可辨别联合
#### never类型
当进行收窄的时候，如果你把所有可能的类型都穷尽了，TypeScript 会使用一个 never 类型来表示一个不可能存在的状态。
#### 穷尽检查
switch当出现还没有处理的分支情况时，never就会发挥作用。

## 函数

### 泛型函数
泛型就是被用来描述两个值之间的对应关系。所谓泛型就是用一个相同类型来关联两个或者更多的值。

### 当写一个回调函数的类型时，不要写一个可选参数，除非真的打算调用函数的时候不传入实参

### 函数重载
TypeScript 只能一次用一个函数重载处理一次函数调用
实现签名: 签名函数不能被调用
尽可能的使用联合类型替代重载

#### void
表示一个函数并不会返回任何值，当函数并没有任何返回值，或者返回不了明确的值的时候，就应该用这种类型。

#### object 可以表示任何不是原始类型（primitive）的值 (string、number、bigint、boolean、symbol、null、undefined
object 不同于 Object ，总是用 object!

#### unknown
unknown 类型可以表示任何值。有点类似于 any，但是更安全，因为对 unknown 类型的值做任何事情都是不合法的

#### never 表示一个值不会再被观察到 (observed)

#### Function
在 JavaScript，全局类型`Function`描述了 bind、call、apply 等属性，以及其他所有的函数值。
`Function`类型的值总是可以被调用，结果会返回 any 类型

### 剩余参数
除了用可选参数、重载能让函数接收不同数量的函数参数，我们也可以通过使用剩余参数语法
剩余参数必须放在所有参数的最后面。
剩余参数的类型会被隐式设置为`any[]`而不是 any，如果你要设置具体的类型，必须是`Array<T>`或者`T[]`的形式，再或者就是元组类型（tuple type）

#### 参数结构赋值


## 对象类型
### 属性修饰符
#### 可选属性
在`strictNullChecks`模式下，TypeScript会提示属性值可能是`undefined`.
1,特殊判断处理2,专门的语法糖提供默认值
#### readonly属性
`readonly`并不意味一个值就完全是不能变的，内部的内容是可变。
TypeScript在检查两个类型是否兼容的时候，并不会考虑两个类型里的属性是否是`readonly`,
`readonly`的值是可以通过别名修改的。
### 索引签名
一个索引签名的属性类型必须是`string`或者是`number`。
所有的属性要匹配索引签名的返回类型。
### 属性继承
对接口使用`extends`关键字允许我们有效的从其他声明过的类型中拷贝成员，并且随意添加新成员。
### 交叉类型
用于合并已经存在的对象类型

### 属性继承与交叉类型
最原则的不同在于冲突怎么解决。继承方式重写类型会导致错误,而交叉类型不会。

### Array类型
Array本身就是一个泛型. `Map<K, V>` `Set<T>` `Promise<T>`
```TS
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}
```

#### ReadonlyArray
特殊的类型，数组不能被改变.
Array和ReadonlyArray不能双向赋值。

### 元组类型
元组是另一种`Array`类型，明确知道数组中包含多少个元素，并且每个元素的类型都明确知道。
数组的结构语法结构元祖。
可选属性，必须在最后面，而且会影响类型的length.
可以使用剩余语法，但必须是array/tuple类型，
readonly => 数组字面量`const`断言，也会被推断为readonly元组类型

## 泛型

## keyof
对一个对象类型使用 keyof 操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合.
如果对象是一个确定的key,不含索引签名，keyof就得到确定的key
如果是数组确定key是number,则得到'number'
如果确定key是string,则得到'number' | 'string'

## typeof
可以在类型上下文中使用，用于获取一个变量或者属性的类型

`ReturnType<T>`传入一个函数类型，`RetuenType<T>`会返回该函数的返回值的类型.
如果没有函数类型，只有函数时，需要使用typeof处理，就会得到函数所对应的类型。

typeof 只有对标识符(比如变量名)或者他们的属性使用`typeof`才是合法的。

> Partial`<`Type`>`

