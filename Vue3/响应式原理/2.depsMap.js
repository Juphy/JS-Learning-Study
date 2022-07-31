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
