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
