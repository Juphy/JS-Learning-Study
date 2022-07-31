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

console.log(`before update --- total: ${total}, salePrice: ${salePrice.value}`)

product.price = 20
console.log(`before update --- total: ${total}, salePrice: ${salePrice.value}`)

product.quantity = 2
console.log(`before update --- total: ${total}, salePrice: ${salePrice.value}`)
