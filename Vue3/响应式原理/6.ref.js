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
