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

const ref = (raw) => {
  const r = {
    get value() {
      track(r, "value")
      return raw
    },
    set value(newVal) {
      if (raw !== newVal) {
        raw = newVal
        trigger(r, "value")
      }
    }
  }
  return r
}

const computed = (getter) => {
  let result = ref()
  effect(() => (result.value = getter()))
  return result
}

const reactive = (target) => {
  const handler = {
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
  return new Proxy(target, handler)
}

const product = reactive({ price: 10, quantity: 1 })
const salePrice = computed(() => {
  return product.price * 0.9
})
const total = computed(() => {
  return salePrice.value * product.quantity
})

console.log(`before updated. salePrice:${salePrice.value}  total:${total.value}`)

product.price = 20
console.log(`before updated. salePrice:${salePrice.value}  total:${total.value}`)

product.quantity = 2
console.log(`before updated. salePrice:${salePrice.value}  total:${total.value}`)

product.name = 'Shoes'
effect(() => {
    console.log(`product name: ${product.name}`)
})
product.name = 'Thirts'