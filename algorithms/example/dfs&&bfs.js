//     1
//   2   3
// 4  5 6  7
//8         9
var tree = {
    val: 1,
    left: {
        val: 2,
        left: {
            val: 4,
            left: {
                val: 8
            }
        },
        right: {
            val: 5
        }
    },
    right: {
        val: 3,
        left: {
            val: 6
        },
        right: {
            val: 7,
            right: {
                val: 9
            }
        }
    }
}

// 深度优先遍历，利用栈，从根节点开始，依次将右、左节点入栈
// 后进先出，优先遍历后push进的数据
function dfs(tree) {
    let stack = [tree],
        result = []
    while (stack.length) {
        let last = stack.pop()
        result.push(last.val)
        let left = last.left,
            right = last.right
        if (right) stack.push(right)    
        if (left) stack.push(left)
    }
    return result
}
console.log(dfs(tree))

// 广度优先遍历，利用队列，先进先出，从根节点开始，依次将左节点、右节点push进数组
// 先进先出，优先遍历已经push进数组的数据
function bfs(tree) {
    let queue = [tree],
        result = []
    while (queue.length) {
        let first = queue.shift()
        result.push(first.val)
        let left = first.left,
            right = first.right
        if (left) queue.push(left)
        if (right) queue.push(right)
    }
    return result
}

console.log(bfs(tree))