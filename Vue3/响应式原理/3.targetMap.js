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
