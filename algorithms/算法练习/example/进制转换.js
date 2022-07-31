// 10进制转换成其他进制
function toString(num, radix = 10) {
  if (radix < 2 || radix > 36) {
    throw RangeError("radix argument must be between 2 and 36")
  }
  let s = ""
  while (num >= 1) {
    let mod = num % radix
    s = mod + s
    num = (num - mod) / radix
  }
  return s
}
console.log(toString(100, 2))
console.log((100).toString(2))

// 其他进制转换成10进制
function ParseInt(s, radix = 10) {
  if (radix < 2 || radix > 36) {
    return NaN
  }
  let _s = "", i = 0
  while (i < s.length) {
    let cur = s[i]
    if(!isNaN(cur)){
      if (s[i] < radix) {
        _s += s[i++]
      }
    }else{
      break
    }
  }
  if(_s === '') return NaN
  let len = _s.length, j = len-1, res = 0
  while(j >= 0){
    res += (_s[j] * Math.pow(radix, len - 1 - j))
    j--
  }
  return res
}

console.log(ParseInt('123123', '1'))
console.log(parseInt('123123', '1'))
console.log(ParseInt('34ab234', '6'))
console.log(parseInt('34ab234', '6'))