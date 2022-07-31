## Interface和Type
> 都可以描述对象或函数

```JS
// 接口
interface Sister{
    name: string;
    age: number;
}

interface SetSister{
    (name: string, age: number): void;
}

// 类型别名
type Sister = {
    name: string;
    age: number;
}
type SetSister = (name: string, age: number)=>void;
```
> 都可以扩展

`interface`和`type`可以混合扩展，也就是说`interface`可以扩展`type`，`type`也可以扩展`interface`.
接口的扩展是`extends`，类型别名的扩展就是交叉类型（通过`&`实现）。
```JS
// 接口
interface SisterAn{
    name: string;
}

// 类型别名
type SisterRan = {
    age: number;
}

interface Sister extends SisterAn{
    age: number;
}

type SisterPro = SisterRan & {
    name: string
}

interface Sister extends SisterRan{
    name: string;
}

type SisterPro = SisterAn &{
    age: nunber;
}
```
`几乎接口的所有特性都可以通过类型别名来实现，主要区别在于：`
1. 不同的声明范围
与接口不同，可以为任意的类型创建类型别名。类型别名的右边可以是任何类型，包括基本类型、元组、类型表达式（`&`或`|`等），而在接口声明中，右边必须为变量结构。
```TS
type Name = string;
type Text = string | { text: string };
type Coordinates = [ number, number ];
```
2. 不同的扩展形式
接口通过继承的方式来扩展，类型别名是通过`&`来扩展。
```JS
// 接口扩展
interface SisterAn{
    name: string;
}
interface Sister extends SisterAn{
    age: number;
}

// 类型别名扩展
type SisterRan = {
    age: number;
}
type SisterPro = SisterRan &{
    name: string;
}
```
接口扩展时，typescript会检查扩展的接口是否可以赋值给被扩展的接口。
```TS
interface SisterAn {
    name: string;
    age: number;
}

interface Sister extends SisterAn {
    name: string;
    age: number;
}
// 报错
// Interface Sister incorrectly extends interface SisterAn.
// Types of property age are incompatible
// Type number is not assignable to type string
```
但是使用交集类型就不会出现这种情况
```TS
type SisterRan = {
    name: string;
    age: number;
}
type SisterPro = SisterRan & {
    name:string;
    age: number;
}
```
类型别名扩展时，typescript将尽其可能把扩展和被扩展的类型组合在一起，而不会抛出编译时错误。

3. 不同的重复定义表现形式
接口可以定义多次，多次的声明会自动合并。
```TS
interface Sister {
    name: string;
}
interface Sister {
    age: number;
}

const sisterAn: Sister = {
    name: 'sisterAn'
}
// 报错：Property 'age' is missing in type '{ name: string }' but required in type 'Sister'
const sisterRan: Sister = {
    name: 'sisterRan',
    age: 12
} 
```
但是类型别名如果定义多次，会报错
```TS
type Sister = {
    name : string;
}
type Sister = {
    age: number;
}
```
### 如何选择Interface、Type
大多数情况下，对象类型的简单类型别名的作用与接口非常相似。
```TS
interface Foo { prop: string }

type Bar = { prop: string }
```
但是，一旦需要组合两个或多个类型来实现其他类型时，就可以选择使用接口扩展这些，
或者使用类型别名将它们交叉在一个中（交叉类型），这就是差异开始的时候。
- 接口创建一个单一的平面对象类型来检测属性冲突，这通常很重要！而交叉类型只是递归的进行属性合并，在某种情况下可能产生`never`类型
- 接口也始终显示的更好，而交叉类型作为其他交叉类型的一部分时，直观上表现不出来，还是会认为是不同基本类型的组合
- 接口之间的类型关系会被缓存，而交叉类型会被看成组合起来的一个整体
- 检查到目标类型之前会先检查每一个部分

简单的说，接口更加符合JavaScript对象的工作方式，当出现属性冲突时：
```TS
// 接口扩展
interface Sister{
    sex: number;
}

interface SisterAn extends Sister{
    sex: string;
}
// index.ts(5,11): error TS2430: Interface 'SisterAn' incorrectly extends interface 'Sister'.
// Types of property 'sex' are incompatible.
// Type 'string' is not assignable to type 'number'.

// 交叉类型
type Sister1 = {
    sex: number;
}
type Sister2 = {
    sex: string;
}
type SisterAn = Sister1&Sister2;
// 不报错，此时的SisterAn是一个'number&string'类型，也就是never.
```