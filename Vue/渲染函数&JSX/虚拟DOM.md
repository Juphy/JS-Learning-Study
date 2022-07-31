Vue 推荐在绝大数情况下使用模板来创建 HTML，然后在一些场景中，需要 JS 的编程能力，这时就需要使用`渲染函数`，它比模板更接近编译器。

```Html
<h1>
    <a name="hello-world" href="#hello-world">
        Hello world!
    </a>
</h1>

<!-- 对于上面的html，可以这样定义组件接口 -->
<anchored-heading :level="1">Hello World!</anchored-heading>
```

通过`level`prop 动态生成标题的组件

```JS
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

`render`函数实现

```JS
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### 虚拟 DOM

Vue 通过建立一个`虚拟DOM`来追踪自己要如何改变真实 DOM。

```JS
return createElement('h1', this.blogTitle);
```

`createElement`返回的其实不是一个实际的 DOM 元素，更准确的名字是`createNodeDescription`,
因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，包括及其子节点的描述信息。这样的节点描述为
`虚拟节点`（virtual node）也就是`VNode`。`虚拟DOM`是由 Vue 组件建立起来的整个 VNode 树的称呼。

### `createElement`参数

```JS
// @returns {VNode}
createElement(
    // {String | Object | Function}
    // 一个HTML标签名、组件选项对象，或者resolve了上述任何一种async函数。必填项。
    'div',

    // {Object}
    // 一个与模板中attribute对应的数据对象。可选
    {

    },

    // {String | Array}
    // 子级虚拟节点（VNode），由`createElement()`构建而成，也可以使用字符串来生成“文本虚拟节点”。可选。
    [
        "先写一些文字"，
        createElement("h1", "一则头条"),
        createElement(myComponent, {
            props: {
                someProp: 'foobar'
            }
        })
    ]
)
```

### 深入数据对象

正如`v-bind:class`和`v-bind:style`在模板语法中会被特别对待一样，它们在 VNode 数据对象中也有对应的顶层字段。
该对象允许绑定普通的 HTML attribute，也允许绑定如 innerHTML 这样的 DOM property

```JS
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```

### VNode 必须唯一

`组件树中的所有VNode必须是唯一的`，创建好的VNode不能重复利用，但是可以重复创建。

```JS
// 下面这个渲染函数是不合法的
render: function(createElement){
    var myParagraphVNode = createElement('p', 'hi');
    return createElement('div', [
        myParagraphVNode, myParagraphVNode
    ])
}
```

```JS
// 如果真的需要重复很多次的元素/组件,可以使用工厂函数来实现
render: function(createElement){
    return createElement('div',
        Array.apply(null, { length: 20 }).map(function(){
            return createElemnt('p', 'hi')
        })
    )
}
```

### 使用 JavaScript 代替模板功能

> `v-if`和`v-for`

```html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

=>

```JS
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

> v-model

渲染函数中没有与`v-model`直接对应，这就需要自己实现相应的逻辑。

```JS
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

### 事件&按键修饰符

对于 `.passive`、`.capture` 和 `.once` 这些事件修饰符，Vue 提供了相应的前缀可以用于 `on`：
|修饰符|前缀|
|:--|:--:|
|.passive|&|
|.capture|!|
|.once|~|
|.capture.once 或.once.capture|~!|

```JS
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

对于其他的修饰符，私有前缀都不是必须的，可以再事件处理函数中使用事件方法：
|修饰符|处理函数中的等价操作|
|:--|:--|
|.stop|event.stopProppagation()|
|.prevent|event.preventDefault()|
|.self|if(event.target !== event.currentTarget) return|
|按键:.enetr, .13|if(event.keyCode!==13)return (对于别的按键修饰符来说，可将 13 改为另一个按键码)|
|修饰键: .ctrl, .alt, .shift, .meta|if(!event.ctrlKey)return (将 ctrlKey 分别修改为 altKey、shiftKey 或者 metaKey))|

```JS
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止 事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

### 插槽
通过`this.$slot`访问静态插槽的内容，每个插槽都是一个VNode数组：
```JS
render: function(createElement){
    // `<div><slot></slot></div>`
    return createElement('div', this.$slots.default)
}
```

也可以通过`this.$scopedSlots`访问作用域插槽，每个作用域插槽都是一个返回若干VNode的函数:
```JS
props: ['message'],
render: function(createElement){
    // `<div><slot :text="message"></slot></div>`
    return createElement('div', [
        this.$scopedSlots.default({
            text: this.message
        })
    ])
}
```

如果要用渲染函数向子组件中传递作用域插槽，可以利用VNode数据对象中的`scopedSlots`字段
```JS
render: function (createElement) {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return createElement('div', [
    createElement('child', {
      // 在数据对象中传递 `scopedSlots`
      // 格式为 { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX
当对应的模板如此简单的情况下，render函数使用起来过于麻烦。所以会有一个`Babel插件`，用于在Vue中使用JSX语法，
它可以帮助我们回到更接近于模板的语法上。

`babel插件`:
```JS
npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props

// babel.config.js
module.exports = {
  presets: ['@vue/babel-preset-jsx']
}
```

```Html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```
==>
```JS
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

### 函数式组件
一个接收一些prop的函数，无状态，没有响应式数据，有没有实例（没有this上下文）
```JS
Vue.component('my-component', {
  functional: true,
  // Props是可选的
  props: {
    // ...
  },
  render: function(createElement, context){
    // ...
  }
})
```
在2.3.0之前，如果一个函数式组件想要接收prop，则`props`选项是必须的，在2.3.0之后的版本可以省略`props`选项，所有组件上的 attribute 都会被自动隐式解析为 prop。
当使用函数式组件时，该引用将会是 HTMLElement，因为他们是无状态的也是无实例的。