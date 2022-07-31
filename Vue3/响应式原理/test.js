;(function () {
  let price = 10,
    quantity = 2,
    total = 0
  let effect = () => {
    total = price * quantity
  }
  const dep = new Set()
  const track = () => {
    dep.add(effect)
  }
  const trigger = () => {
    dep.forEach((effect) => {
      effect()
    })
  }

  track()
})()
;(function () {
  let product = { price: 10, quantity: 2 },
    total = 0
  let effect = () => {
    total = product.price * product.quantity
  }
  let depsMap = new Map()
  let track = (key) => {
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(effect)
  }
  let trigger = (key) => {
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach((effect) => {
        effect()
      })
    }
  }
  track("quantity")

  trigger("quantity")
  product.quantity = 3
  trigger("quantity")
})()
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

  let product = reactive({ price: 10, quantity: 1 }), total = 0
  let effect = () => {
      total = product.price * product.quantity
  }
  effect()
  console.log(`before updated, total: ${total}`)

  product.price = 20
  console.log(`after updated price, total: ${total}`)

  product.quantity = 2
  console.log(`after updated quantity, total: ${total}`)
})()
;(function(){
    let targetMap = new WeakMap()
    let activeEffect = null
    let effect = (eff) => {
        activeEffect = eff
        activeEffect()
        activeEffect = null
    }
    function track(target, key){
        if(activeEffect){
            let depsMap = targetMap.get(target)
            if(!depsMap){
                targetMap.set(target, (depsMap = new Map()))
            }
            let dep = depsMap.get(key)
            if(!dep){
                depsMap.set(key, (dep = new Set()))
            }
            dep.add(activeEffect)
        }
    }
    function trigger(target, key){
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
    const computed = (getter) => {
        let result = ref()
        effect(() => result.value = getter())
        return result
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
                if(oldValue !== value){
                    trigger(target, key)
                }
                return result
            }
        }
        return new Proxy(target, handler)
    }
    let product = reactive({ price: 10, quantity: 1 })
    let salePrice = computed(() => {
        return product.price*0.9
    })
    let total = computed(() => {
        return salePrice.value * product.quantity
    })
    console.log(`salePrice: ${salePrice.value}, quantity: ${product.quantity}, total: ${total.value}`)

    product.price = 20
    console.log(`salePrice: ${salePrice.value}, quantity: ${product.quantity}, total: ${total.value}`)

    product.quantity = 2
    console.log(`salePrice: ${salePrice.value}, quantity: ${product.quantity}, total: ${total.value}`)

    product.name = 'Shoes'
    effect(() => {
        console.log(`Product name is now ${product.name}`)
    })
    product.name = 'Socks'
})()
