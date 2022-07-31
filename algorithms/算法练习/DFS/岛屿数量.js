/**
 * 岛屿问题
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1

输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/number-of-islands
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
*/
let numIslands = function (grid) {
    let count = 0
    for (let i = 0; i < grid.length; i++) {
        let row = grid[i]
        for (let j = 0; j < row.length; j++) {
            if (row[j] === '1') {
                dfs(grid, i, j)
                count++
            }
        }
    }

    function dfs(grid, i, j) {
        let point = grid[i] && grid[i][j]
        if (point === '0' || point === undefined) return
        grid[i][j] = '0'// 将格子的值改为0避免重复遍历
        dfs(grid, i - 1, j) // 上
        dfs(grid, i + 1, j) // 下
        dfs(grid, i, j - 1) // 左
        dfs(grid, i, j + 1) // 右
    }

    return count;
}

let grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"]
]
console.log(numIslands(grid))