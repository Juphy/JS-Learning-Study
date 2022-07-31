### 类型提取
```TS
interface Dictionary<T = any> {
  [key: string]: T;
}
 
type StrDict = Dictionary<string>

type StrDictMember = StrDict[''] // string

type DictMember<T> = T extends Dictionary<infer U> ? U : never
type strDictMember1 = DictMember<StrDict> // string
```

### 条件类型以及infer
```TS
T extends U? X : Y
```
若`T`能够赋值给`U`，那么类型是`X`, 否则为`Y`。
`T extends Dictionary<infer V> ? V : never`条件表达式中多出一个`infer`关键字，在条件类型表达式中，可以用`infer`声明一个类型变量并且对它进行使用。

获取Promise对象返回值类型
```TS
async function stringPromise(){
    return 'hello world!'
}
interface Person{
    name: string;
    age: number;
}
async function personPromise(){
    return { name: 'Semlinker', age: 30 } as Person
}

type PromiseType<T> = (args: any[]) => Promise<T>
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never

type extractStringPromise = UnPromisify<typeof stringPromise>
type extractPersonPromise = UnPromisify<typeof personPromise>
```

### ReturnType
官方提供了`ReturnType`可方便获取返回类型，具体实现如下:
```TS
type ReturnType<T> = T extends (args: any[]) => infer U? U : T
```