### Proxy

```JS
var Obj = new Proxy({}, {
  get: function (target, propKey, receiver){
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function(target, propKey, receiver){
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
})
```

> new Proxy(target, handler);

- 第一个参数是所要代理的目标对象，即如果没有`Proxy`的介入，操作原来要访问的就是这个对象
- 第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作
