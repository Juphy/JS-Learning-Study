Array.prototype.map = function (cb, context) {
  let res = [], that = context || null;
  for (let i = 0; i < this.length; i++) {
    res.push(cb.call(that, this[i], i, this));
  }
  return res;
}

let arr = [
  { pid: 0, id: 1, name: 1 },
  { pid: 1, id: 2, name: 1 },
  { pid: 1, id: 3, name: 1 },
  { pid: 2, id: 4, name: 1 },
  { pid: 3, id: 5, name: 1 }
];
let arrToTree = function (arr) {
  function fn(data, pid) {
    data.children = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pid === pid) {
        data.children.push(arr[i]);
        fn(arr[i], arr[i].id);
      }
    }
  }
  let res = arr.filter(item => item.pid === 0);
  for (let i = 0; i < res.length; i++) {
    fn(res[i], res[i].id);
  }
  return res;
}

/**
 * webpack
 * 渲染机制
 * 运行原理
 * CSS模块化
 * TypeScript中interface和type
 * Vue3为什么使用proxy?
 * defer/async
 * commonjs/module
 */
