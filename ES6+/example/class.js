class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}
let p = new Point();
console.log(typeof Point); // 'function'
console.log(Point === Point.prototype.constructor); // true
console.log(p.constructor === Point.prototype.constructor); // true

class Bar {
  doStuff() {
    console.log('stuff');
  }
}

var b = new Bar();
b.doStuff();

Object.assign(Point.prototype, {
  toValue() { }
})

class Foo {
  constructor() {
    return Object.create(null);
  }
}

console.log(new Foo() instanceof Foo)
// Foo();

var point = new Point(2, 3);
console.log(point.toString());

console.log(point.hasOwnProperty('x'));
console.log(point.hasOwnProperty('y'));
console.log(point.hasOwnProperty('toString'));
console.log(point.__proto__.hasOwnProperty('toString'));

var p1 = new Point(2, 3);
var p2 = new Point(3, 2);

console.log(p1.__proto__ === p2.__proto__);
p1.__proto__.printName = function () {
  return 'Oops'
}
console.log(p1.printName());
console.log(p2.printName());

var p3 = new Point(4, 2);
console.log(p3.printName());

class MyClass {
  constructor() {

  }

  get prop() {
    return 'getter';
  }

  set prop(value) {
    console.log('setter: ' + value);
  }
}

let inst = new MyClass();
inst.prop = 123;
console.log(inst.prop);

class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, 'html'
);

console.log('get' in descriptor);
console.log('set' in descriptor);

const MyClass1 = class Me {
  getClassName() {
    return Me.name;
  }
}

class Foo1 {
  constructor(...args) {
    this.args = args;
  }

  *[Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }

  static classMethod() {
    return 'hello world!';
  }

  static bar() {
    this.baz();
  }

  static baz() {
    console.log('hello');
  }

  baz() {
    console.log('world');
  }
}
for (let x of new Foo1('hello', 'world')) {
  console.log(x);
}

console.log(Foo1.classMethod());

var foo1 = new Foo1();
// foo1.classMethod();
Foo1.bar();

class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

class IncreasingCounter1 {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

class MyClass2 {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass2.myStaticProp);
  }
}

var myclass2 = new MyClass2();

class Widget {
  // ????????????
  foo(baz) {
    this._bar(baz);
  }
  // ????????????
  _bar(baz) {
    return this.snaf = baz;
  }
}

class Widget1 {
  foo(baz) {
    bar.call(this, baz);
  }
  //...
}

function bar(baz) {
  return this.snaf = baz;
}

const a1 = Symbol('bar');
const a2 = Symbol('snaf');

class A1 {
  // ????????????
  foo(baz) {
    this[bar](baz);
  }

  // ????????????
  [bar](baz) {
    return this[snaf] = baz;
  }
}

const inst1 = new MyClass();
console.log(Reflect.ownKeys(Foo1.prototype));

function Person(name) {
  if (new.target !== undefined) {
    this.name = name
  } else {
    throw new Error('???????????? new ??????????????????');
  }
}

function Person1(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('???????????? new ??????????????????');
  }
}
var person = new Person('??????');
// var noteAPerson = Person.call(person, '??????');

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4);

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // ???????????????constructor(x,y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // ???????????????toString()
  }
}

// Proxy??????????????????
const PrivateTar = function () {
  this.title = '??????????????????';
  this.set = secret => {
    _secretTar = secret;
  }
  this.get = () => {
    return _secretTar;
  }
}
const privateTar = new PrivateTar();
privateTar.set('set??????');

let TargetData = {
  _secretTar: '??????????????????',
  title: '??????????????????'
}
ProxyTarget = new Proxy(TargetData, {
  get: function (target, prop) {
    if (prop.startsWith('_')) {
      console.log('????????????????????????');
      return false;
    }
    return target[prop]
  },
  set: function (target, prop, value) {
    if (prop.startsWith('_')) {
      console.log('????????????????????????');
      return false;
    }
    target[prop] = value;
  },
  // in ?????????????????????
  has: function (target, prop) {
    return prop.startsWith('_') ? false : (prop in target);
  }
})
ProxyTarget._secretDrink; //

// ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
let dataStore = {
  noDelete: 1235,
  oldMethod: () => { },
  doNotChange: 'tried and true'
};
const NODELETE = ['noDelete'];
const DEPRECATED = ['oldMethod'];
const NOCHANGE = ['doNotChange'];
dataStore = new Proxy(dataStore, {
  set(target, prop, value, proxy) {
    if (NOCHANGE.includes(key)) {
      throw Error('Error! ${key} is immutable.');
    }
    return Reflect.set(target, prop, value, proxy)
  },
  deleteProperty(target, key) {
    if (NODELETE.includes(key)) {
      throw Error(`Error! ${key} cannot be deleted.`)
    }
    return Reflect.deleteProperty(target, key)
  },
  get(target, key, proxy) {
    if (DEPRECATED.includes(key)) {
      throw Error(`Error! ${key} is deprecated.`)
    }
    var val = target[prop];
    return typeof val === 'function' ? function (...args) {
      Reflect.apply(target[key], target, args)
    } : val;
  }
})

// ????????????
let ValidatorUtil = {
  phoneNum: function (value) {
    let re = /^1[0-9]{10}$/;
    if (!re.test(value)) {
      throw Error(`Cannot set phonenumber to ${value}. Wrong format. Should be 1xx-xxxx-xxxx`);
    }
  }
}
ProxyTargetValidatorUtil = new Proxy(ValidatorUtil, {
  set: function (target, prop, value) {
    if (!ValidatorUtil[prop](value)) {
      target[prop] = value;
    }
  }
})

// ??????proxy????????????????????????

// ????????????????????????????????????
/**
 * class???????????????????????????????????????new???????????????????????????Class???????????????????????????
 * ??????`Proxy`????????????????????????????????????????????????????????????
 */
class Test {
  constructor(a, b) {
    console.log('constructor', a, b)
  }
}

let proxyTest = new Proxy(Test, {
  apply: function (target, thisArg, argumentsList) {
    return new (target.bind(thisArg, ...argumentsList))()
  }
})
proxyTest(1, 2)

// ??????????????????
const country = {
  name: 'China',
  city: {
    name: 'Beijing',
    area: {
      name: 'HaiDian'
    }
  }
}
let isFirst = true;
function noop() { }
let ProxyVoid = getData(undefined);
function getData(obj) {
  if (obj === undefined && !isFirst) {
    return ProxyVoid;
  }
  if (obj === undefined && isFirst) {
    isFirst = false;
  }
  return new Proxy(noop, {
    apply(target, context, [args]) {
      return obj === undefined ? args : obj
    },
    get(target, prop) {
      if (obj !== undefined && obj !== null && obj.hasOwnProperty(prop)) {
        return getData(obj[prop])
      }
      return ProxyVoid
    }
  })
}
console.log(getData(country)() === country);
console.log(getData(country).city.name());
console.log(getData(country).city.name.xxxx.yyyy.zzzz());

class A {
  static a = 1
  constructor() {
    this.b = 1;
    this.x = 1;
  }
  static fn1() {
    console.log(123)
  }
  fn2() {
    console.log(456)
  }
}

class B extends A {
  constructor(){
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x);
    console.log(this.x);
  }
  fn() {
    console.log(super.a)
    console.log(super.b)
    console.log(super.fn1 && super.fn1())
    console.log(super.fn2 && super.fn2())
  }
}
b = new B();
b.fn();

