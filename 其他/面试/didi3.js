function filterText(str) {
  let o = {};
  for (let i = 0; i < str.length; i++) {
    let s = str[i];
    if (o[s]) {
      o[s] += 1;
    } else {
      o[s] = 1;
    }
  }
  let s = [], l = 0;
  for (let key in o) {
    if (!l) {
      s = [key];
      l = o[key];
    } else if (o[key] === l) {
      s.push(key);
    } else if (o[key] < l) {
      s = [key];
      l = o[key]
    }
  }
  let res = '';
  for (let i = 0; i < str.length; i++) {
    let r = str[i];
    if (!s.includes(r)) {
      res += r;
    }
  }
  return res
}

console.log(filterText('ababac'));
console.log(filterText('aaabbbcceeff'));

let num1 = 123456, num2 = 100010001;
function trans(num) {
  num = num.toSTring();
  let res = '', o = { 1: '十', 2: '百', 3: '千', 4: '万', 8: '亿' }, len = num.length;
  let fn = function (str) {

  }
  if (num.slice(0, -8)) {

  }
  if (num.slice(-8, -4)) {

  }
  if (num.slice(-4, 0)) {

  }

}