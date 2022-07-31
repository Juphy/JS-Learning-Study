// 单个值的响应式

const { NULL } = require("mysql2/lib/constants/types")

// basic.js
;(function () {
  let price = 10,
    quantity = 2,
    total = 0
  const dep = new Set()
  const effect = () => {
    total = price * quantity
  }
  const track = () => {
    dep.add(effect)
  }
  const trigger = () => {
    dep.forEach((effect) => {
      effect()
    })
  }
  track()
  console.log(`total:${total}`)
  trigger()
  console.log(`total:${total}`)
  price = 20
  trigger()
  console.log(`total:${total}`)
})()

// depsMap.js 单个对象的响应式
;(function () {
  let product = { price: 10, quantity: 2 },
    total = 0
  const depsMap = new Map()
  const effect = () => {
    total = product.price * product.quantity
  }
  const track = (key) => {
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(effect)
  }
  const trigger = (key) => {
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((effect) => {
        effect()
      })
    }
  }
  track("quantity")
  console.log(`total: ${total}`)

  trigger("quantity")
  console.log(`total: ${total}`)

  product.quantity = 3
  trigger("quantity")
  console.log(`total: ${total}`)
})()
// 实现多个对象的响应式
// 有多个响应式数据，同时需要观察对象
;(function () {
  let product1 = { price: 10 },
    product2 = { quantity: 1 },
    total = 0
  let effect = () => {
    total = product1.price * product2.quantity
  }
  const targetMap = new WeakMap()
  const track = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(effect)
  }
  const trigger = (target, key) => {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((effect) => {
        effect()
      })
    }
  }
  track(product1, "price")
  track(product2, "quantity")
  console.log(`total: ${total}`)

  trigger(product1, "price")
  trigger(product2, "quantity")
  console.log(`total: ${total}`)

  product1.price = 20
  trigger(product1, "price")
  console.log(`total: ${total}`)

  product2.quantity = 2
  trigger(product2, "quantity")
  console.log(`total: ${total}`)
})()

// 使用Proxy自动触发track和trigger
;(function () {
  const targetMap = new WeakMap()
  const track = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(effect)
  }
  const trigger = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((effect) => {
        effect()
      })
    }
  }

  function reactive(target) {
    const handlers = {
      get(target, key, receiver) {
        let result = Reflect.get(target, key, receiver)
        track(target, key)
        return result
      },
      set(target, key, value, receiver) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if (result && oldValue !== value) {
          trigger(target, key)
        }
        return result
      }
    }
    return new Proxy(target, handlers)
  }
  let product = reactive({ price: 10, quantity: 1 })
  let total = 0
  let effect = () => {
    total = product.price * product.quantity
  }
  effect()
  console.log(`before updated quantity total: ${total}`)

  product.quantity = 2
  console.log(`after updated quantity total: ${total}`)

  product.price = 20
  console.log(`after updated quantity total: ${total}`)
})()

// 解决track函数中的依赖(effect函数)是外部定义的
// 当依赖发生变化，track函数收集依赖时都要手动修改其依赖的方法名
;(function () {
  const targetMap = new WeakMap()
  let activeEffect = null
  const effect = (eff) => {
    activeEffect = eff
    activeEffect()
    activeEffect = null
  }

  const track = (target, key) => {
    if (activeEffect) {
      let depsMap = targetMap.get(target)
      if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
      }
      let dep = depsMap.get(key)
      if (!dep) {
        depsMap.set(key, (dep = new Set()))
      }
      dep.add(activeEffect)
    }
  }

  const trigger = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((effect) => {
        effect()
      })
    }
  }

  function reactive(target) {
    let handlers = {
      get(target, key, receiver) {
        let result = Reflect.get(target, key, receiver)
        track(target, key)
        return result
      },
      set(target, key, value, receiver) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if (oldValue !== value) {
          trigger(target, key)
        }
        return result
      }
    }
    return new Proxy(target, handlers)
  }
  const ref = (value) => reactive({ value })
  let product = reactive({ price: 10, quantity: 1 }),
    total = 0,
    salePrice = ref(0)

  // 使用值时，自动track
  //   effect(() => {
  //     total = product.price * product.quantity
  //   })
  effect(() => {
    total = salePrice.value * product.quantity
  })
  effect(() => {
    salePrice.value = product.price * 0.9
  })

  console.log(
    `before update --- total: ${total}, salePrice: ${salePrice.value}`
  )

  product.price = 20
  console.log(
    `before update --- total: ${total}, salePrice: ${salePrice.value}`
  )

  product.quantity = 2
  console.log(
    `before update --- total: ${total}, salePrice: ${salePrice.value}`
  )
})()

// 引入ref方法
;(function () {
  const targetMap = new WeakMap()
  let activeEffect = null
  const effect = (eff) => {
    activeEffect = eff
    activeEffect()
    activeEffect = null
  }
  const track = (target, key) => {
    if (activeEffect) {
      let depsMap = targetMap.get(target)
      if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
      }
      let dep = depsMap.get(key)
      if (!dep) {
        depsMap.set(key, (dep = new Set()))
      }
      dep.add(activeEffect)
    }
  }
  const trigger = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((innerEffect) => {
        // effect(innerEffect)
        innerEffect()
      })
    }
  }
  const ref = (raw) => {
    const r = {
      get value() {
        track(r, "value")
        return raw
      },
      set value(newVal) {
        if (newVal !== raw) {
          raw = newVal
          trigger(r, "value")
        }
      }
    }
    return r
  }
  const reactive = (target) => {
    const handlers = {
      get(target, key, receiver) {
        let result = Reflect.get(target, key, receiver)
        track(target, key)
        return result
      },
      set(target, key, value, receiver) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if (oldValue !== value) {
          trigger(target, key)
        }
        return result
      }
    }
    return new Proxy(target, handlers)
  }
  let product = reactive({ price: 10, quantity: 1 }),
    salePrice = ref(0),
    total = 0
  effect(() => {
    total = salePrice.value * product.quantity
  })
  effect(() => {
    salePrice.value = product.price * 0.9
  })

  console.log(`before updated: total:${total}, salePrice:${salePrice.value}`)

  product.price = 20
  console.log(`before updated: total:${total}, salePrice:${salePrice.value}`)

  product.quantity = 2
  console.log(`before updated: total:${total}, salePrice:${salePrice.value}`)

  salePrice.value = 20
  console.log(`before updated: total:${total}, salePrice:${salePrice.value}`)
})()

// 简易实现computed
;(function () {
  const targetMap = new WeakMap()
  let activeEffect = null
  const effect = (eff) => {
    activeEffect = eff
    activeEffect()
    activeEffect = null
  }
  const track = (target, key) => {
    if (activeEffect) {
      let depsMap = targetMap.get(target)
      if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
      }
      let dep = depsMap.get(key)
      if (!dep) {
        depsMap.set(key, (dep = new Set()))
      }
      dep.add(activeEffect)
    }
  }
  const trigger = (target, key) => {
    let depsMap = targetMap.get(target)
    if(!depsMap) return
    let dep = depsMap.get(key)
    if(dep){
      dep.forEach(effect => {
        effect()
      })
    }
  }
  const ref = raw => {
    const r = {
      get value(){
        track(r, 'value')
        return raw
      },
      set value(newVal){
        if(newVal!==raw){
          raw = newVal
          trigger(r, 'value')
        }
      }
    }
    return r
  }
  const reactive = (target) => {
    const handler = {
      get(target, key, receiver){
        let result = Reflect.get(target, key, receiver)
        track(target, key)
        return result
      },
      set(target, key, value, receiver){
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if(oldValue!==value){
          trigger(target, key)
        }
        return result
      }
    }
    return new Proxy(target, handler)
  }
  const computed = getter => {
    let result = ref()
    effect(() => result.value = getter())
    return result
  }
  const product = reactive({ price: 10, quantity: 1 })
  let salePrice = computed(() => {
    return product.price * 0.9
  })
  let total = computed(() => {
    return salePrice.value * product.quantity
  })

  console.log(`before updated. salePrice: ${salePrice.value}, total: ${total.value}`)

  product.price = 20
  console.log(`before updated. salePrice: ${salePrice.value}, total: ${total.value}`)

  product.quantity = 2
  console.log(`before updated. salePrice: ${salePrice.value}, total: ${total.value}`)

  product.name = "Shoes"
  effect(() => {
    console.log(`Product name is now ${product.name}`)
  })

  product.name = "Socks"
})()
