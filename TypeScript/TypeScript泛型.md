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