let arr = [
    { id: 1, name: '部门1', pid: 0 },
    { id: 2, name: '部门2', pid: 1 },
    { id: 3, name: '部门3', pid: 1 },
    { id: 4, name: '部门4', pid: 3 },
    { id: 5, name: '部门5', pid: 4 },
]

// 通过引用的形式 遍历一次，将当前pid不为0时，
// id所对应的数据放到pid所对应的数据children中
function arrayToTree(arr) {
    let result = [], map = {};
    for (let item of arr) {
        map[item.id] = { ...item, children: [] };
    }
    for (let item of arr) {
        let id = item.id, pid = item.pid;
        let treeItem = map[id];
        if (pid === 0) {
            result.push(treeItem)
        } else {
            if (!map[pid]) {
                map[pid] = {
                    children: []
                }
            }
            map[pid].children.push(treeItem)
        }
        console.log(result, map);
    }
    return result
}
console.log(arrayToTree(arr))

function arraytotree(arr){
    let result = [], map = {};
    for(let item of arr){
        let id = item.id, pid = item.pid;

        if(!map.id){
            map[id] = { children: [] }
        }
        map[id] = {
            ...item,
            children: map[id]['children']
        }
        let treeItem = map[id];
        if(pid === 0){
            result.push(treeItem)
        }else{
            if(!map[pid]){
                map[pid] = { children: [] }
            }
            map[pid].children.push(treeItem)
        }
    }
    return result;
}
console.log(arraytotree(arr))

function flatten(arr) {
    const result = [];
    while (arr.length) {
        const next = arr.pop();
        if (Array.isArray(next)) {
            arr.push(...next)
        } else {
            result.push(next)
        }
    }
    return result.reverse()
}
a = [1,[2,[3,[4,5]]]]
console.log(flatten(a))