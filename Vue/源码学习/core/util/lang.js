export const def = function (obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    writable: true,
    configurable: true,
    enumerable: !!enumerable,
    value: val
  })
}
