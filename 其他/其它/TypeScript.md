### 泛型
T是一个抽象类型，只有在调用的时候才确定它的值，如果使用any的话就丧失了检查的作用了。
```JS
enum Sex {
  Man,
  Woman,
  UnKnow,
}
interface Person {
  name: string;
  sex: Sex;
  age: number;
}
// Person三个属性选填，增加一个phone必填

type Partial<T> = { [P in keyof T]?: T[P] };
```

### type和interface的区别
- 都可以描述一个对象或者函数
- 都允许拓展（extends），interface可以extends type，type也可以extends interface
- type类型别名用于其它类型（联合类型、元组类型、基本类型），interface不支持
- interface可以多次定义，并被视为合并所有声明成员，type不支持
- type能使用in关键字生成映射类型，但interface不行
- 默认导出方式不同
    - inteface支持同时声明，默认导出
    - type必须先声明后导出