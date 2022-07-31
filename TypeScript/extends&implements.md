### implements
```TS
A implements B
```
`A`上要有`B`对应的属性和方法，不能用于两个interface之间
- 类与类之间: 没有继承的效果，要求`A`上必须要有定义`B`类的属性和方法
- 类和接口之间: 用接口去规范类，要求`A`上的属性和方法等必须按照`B`接口来定义

### extends
- 类与类之间: 继承
- 接口与接口之间: 继承

`extends`的用法

#### 接口继承
```TS
interface O1 {
    name: string
}
interface O2{
    age: number
}

interface O3 extends O1, O2{
    sex: string
}
```
### 条件判断
> 简单用法

```TS
interface Animal{
    eat(): void
}

interface Dog extends Animal{
    bite(): void
}

type A = Dog extends Animal ? string : number // string


interface O1{
    name: string
}
interface O2{
    name: string;
    age: number
}
type O3 = O2 extends O1 ? string : number // string
```
`A extends B ?`中`extends`前面的类型能够赋值给`extends`后面的类型，则判断为真，否则为假。

> 泛型用法

- 分配条件类型
```TS
type A1 = 'x' extends 'x' ? string : number; // string
type A2 = 'x' | 'y' extends 'x' ? string : number; // number
  
type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'> // string | number
```
分配条件类型: When conditional types act on a generic type, they become distributive when given a union type.

对于使用extends关键字的条件类型（即上面的三元表达式类型），如果extends前面的参数是一个泛型类型，当传入该参数的是联合类型，则使用分配律计算最终的结果。分配律是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。
```TS
P<'x' | 'y'>
=> P<'x'> | p<'y'>
```
```TS
P<'x' | 'y'> => P<'x'> | P<'y'>

'x'代入得到
'x' extends 'x' ? string : number => string

'y'代入得到
'y' extends 'x' ? string : number => number

然后将每一项代入得到的结果联合起来，得到 string | number
```
满足两个要点即可适用分配律: 1.参数是泛型类型 2.代入参数的是联合类型

> 特殊的never

```TS
// never是所有类型的子类型
type A1 = never extends 'x' ? string : number; // string

type P<T> = T extends 'x' ? string : number;
type A2 = P<never> // never
```
`never`被认为是空的联合类型，也就是没有联合项的联合类型，所以还是满足上面的分配律，
然而因为没有联合项可以分配，所以`P<T>`的表达式其实根本就没有执行，所以A2的定义也就类似于
永远没有返回的函数一样，是never类型的。

> 防止条件判断中的分配

```TS
type P<T> = [T] extends ['x'] ? string : number;
type A1 = P<'x' | 'y'> // string | number
type A2 = P<never> // string
```



