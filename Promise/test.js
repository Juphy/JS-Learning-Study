let p = function (t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve(t)
            } else {
                reject(t)
            }
        }, 1000)
    })
}

function multiRequest(urls, maxNum) {
    let len = urls.length, count = 0;
    let result = new Array(len);
    return new Promise((resolve, reject) => {
        while (count < maxNum) {
            next()
        }
        function next() {
            let current = count++;
            if (current >= len) {
                !result.includes() && resolve(result);
                return
            }
            let promise = p(urls[current])
            promise.then(res => {
                console.log('成功', res, Date.now())
                result[current] = res;
                if (current < len) next()
            }).catch(err => {
                console.log('失败', err, Date.now())
                result[current] = err;
                if (current < len) next()
            })
        }
    })
}

//      1
//   2     3
// 4   5 6   7
//8   9       10
// const tree1 = {
//     val: 1,
//     left: {
//         val: 2,
//         left: {
//             val: 4,
//             left: {
//                 val: 8
//             }
//         },
//         right: {
//             val: 5,
//             left: {
//                 val: 9
//             }
//         }
//     },
//     right: {
//         val: 3,
//         left: {
//             val: 6
//         },
//         right: {
//             val: 7,
//             right: {
//                 val: 10
//             }
//         }
//     }
// }

// // 
// function DFS(tree){
//     let stack = [tree], result = [];
//     while(stack.length){
//         let last = stack.pop();
//         result.push(last.val);
//         let left = last.left, right = last.right;
//         if(right) stack.push(right);
//         if(left) stack.push(left);
//     }
//     return result;
// }
// console.log(DFS(tree))

// function BFS(tree){
//     let queue = [tree], result = [];
//     while(queue.length){
//         let first = queue.shift();
//         result.push(first.val);
//         let left = first.left, right = first.right;
//         if (left) queue.push(left);        
//         if (right) queue.push(right);
//     }
//     return result
// }

// console.log(BFS(tree))
arr = [
    { pid: 0, id: 1, name: '1' },
    { pid: 1, id: 2, name: '2' },
    { pid: 1, id: 3, name: '3' },
    { pid: 2, id: 4, name: '4' },
    { pid: 2, id: 5, name: '5' },
    { pid: 3, id: 6, name: '6' },
    { pid: 3, id: 7, name: '7' },
    { pid: 4, id: 8, name: '8' },
    { pid: 5, id: 9, name: '9' },
];
function arrayToTree(arr) {
    let result = [], map = {};
    for (let item of arr) {
        let id = item.id, pid = item.pid;
        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            ...item,
            children: map[id].children
        }
        let mapItem = map[id]
        if (pid === 0) {
            result.push(mapItem)
        } else {
            if (!map[pid]) {
                map[pid] = {
                    children: []
                }
            }
            map[pid].children.push(mapItem)
        }
    }
    return result
}

let tree = arrayToTree(arr)

function DFS(tree) {
    tree = [...tree]
    let result = [];
    while (tree.length) {
        let last = tree.pop();
        result.push({ pid: last.pid, id: last.is, name: last.name });
        let children = last.children;
        if (children && children.length) {
            for (let i = children.length - 1; i >= 0; i--) {
                tree.push(children[i])
            }
        }
    }
    return result
}
console.log(DFS(tree))

function BFS(tree) {
    tree = [...tree]
    let result = [];
    while (tree.length) {
        let first = tree.shift();
        result.push({ pid: first.pid, id: first.is, name: first.name });
        let children = first.children;
        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                tree.push(children[i])
            }
        }
    }
    return result;
}

console.log(BFS(tree))

// [1, 2, 3] 全排
function fnn(arr) {
    let result = [];
    let len = arr.length, map = {}, path = [];
    function dfs() {
        if (path.length === len) {
            result.push([...path]);
            return
        }
        for (let i = 0; i < len; i++) {
            if (!map[i]) {
                map[i] = true;
                path.push(arr[i]);
                dfs();
                map[i] = false;
                path.pop()
            }
        }
    }
    dfs()
    return result
}
console.log(fnn([1, 2, 3, 4]))

// [
//     [1, 2, 3, 4], [1, 2, 4, 3],
//     [1, 3, 2, 4], [1, 3, 4, 2],
//     [1, 4, 2, 3], [1, 4, 3, 2],
//     [2, 1, 3, 4], [2, 1, 4, 3],
//     [2, 3, 1, 4], [2, 3, 4, 1],
//     [2, 4, 1, 3], [2, 4, 3, 1],
//     [3, 1, 2, 4], [3, 1, 4, 2],
//     [3, 2, 1, 4], [3, 2, 4, 1],
//     [3, 4, 1, 2], [3, 4, 2, 1],
//     [4, 1, 2, 3], [4, 1, 3, 2],
//     [4, 2, 1, 3], [4, 2, 3, 1],
//     [4, 3, 1, 2], [4, 3, 2, 1]
// ]

function fn(n) {
    let result = [];
    function dfs(s, left, right) {
        if (left < right || left > n) return
        if (left === n && right === n) {
            result.push(s)
            return;
        }
        dfs(s + '(', left + 1, right)
        dfs(s + ')', left, right + 1)
    }
    dfs('', 0, 0)
    return result
}

console.log(fn(3))

function fn1(str) {
    const map = {
        '{': '}',
        '(': ')',
        '[': ']',
    }
    let result = [];
    for (let i = 0; i < str.length; i++) {
        let s = str[i]
        if (map[s]) {
            result.push(s)
        } else {
            let _s = result.pop()
            if (map[_s] !== s) {
                return false
            }
        }
    }
    return !result.length
}
console.log(fn1('({[]})'))
console.log(fn1('({)[]}'))

class Scheduler {
    constructor(n) {
        this.maxNum = n;
        this.tasks = []
    }

    addTask(delay, data) {
        let task = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(data)
                }, delay * 1000)
            })
        }
        this.tasks.push(task)
    }

    start() {
        let self = this;
        console.log(Date.now())
        let i = 0;
        while (i < this.maxNum) {
            next();
        }
        function next() {
            let current = i++
            if (current >= self.tasks.length) return
            let task = self.tasks[current];
            task().then(res => {
                console.log(res, Date.now())
                if (current < self.maxNum) next()
            })
        }
    }
}
const scheduler = new Scheduler(2)
scheduler.addTask(1, '1');   // 1s后输出’1'
scheduler.addTask(2, '2');  // 2s后输出’2'
scheduler.addTask(1, '3');  // 2s后输出’3'
scheduler.addTask(1, '4');  // 3s后输出’4'
// scheduler.start();

// 1649430094783
// 1 1649430095790
// 2 1649430096797
// 3 1649430096797
// 4 1649430097803

p = function (t, data) {
    return new Promise((resolve, reject) => {
        if(data){
            resolve(data)
        }else{
            // 模拟发送请求
            setTimeout(() => {
                if (Math.random() > 0.9) {
                    resolve(t)
                } else {
                    reject(t)
                }
            }, 1000)
        }
    })
}

function multiRequests(urls) {
    let len = urls.length, count = 0;
    let result = new Array(len);
    return new Promise((resolve, reject) => {
        next();
        function next(data) {
            let current = count++;
            if (current >= len) {
                !result.includes()&&resolve(result)
                return
            };
            let promise = p(urls[current], data)
            promise.then(res => {
                console.log('成功', res, Date.now())
                result[current] = res
                if (current < len) next(res)
            }).catch(err => {
                console.log('失败', err, Date.now())
                result[current] = err
                if (current < len) next()
            })
        }
    })
}
multiRequests([1, 2, 3, 4, 5, 6, 7, 8]).then(res => {
    console.log(res)
})

// 失败 1 1649432439685
// 失败 2 1649432440691
// 失败 3 1649432441695
// 失败 4 1649432442701
// 成功 5 1649432443703
// 成功 5 1649432443703
// 成功 5 1649432443703
// 成功 5 1649432443703
// [ 1, 2, 3, 4, 5, 5, 5, 5 ]