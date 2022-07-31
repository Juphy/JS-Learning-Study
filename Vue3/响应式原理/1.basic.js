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
