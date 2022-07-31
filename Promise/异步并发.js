function p(t){
    return new Promise((reslve, reject) => {
        setTimeout(function(){
            if(Math.random() > 0.5){
                reslve(t)
            }else{
                reject(t)
            }
        }, 1000)
    })
}

function multiRequest(urls, maxNum){
    let len = urls.length, count = 0, result = new Array(len);
    return new Promise((resolve, reject) => {
        while(count < maxNum){
            next();
        }
        function next(){
            let current = count++;
            if(current >= len){
                resolve(result);
                return;
            }
            let promise = p(current);
            promise.then(res => {
                result[current] = {
                    status: 'fulfilled',
                    value: res
                }
                console.log('完成', res, Date.now())
                if(current < len) next()
            }).catch(err => {
                result[current] = {
                    statue: 'rejected',
                    reason: err
                }
                console.log('结束', err, Date.now())
                if(current < len) next()
            })
        }
    })
}

multiRequest([1,2,3,4,5,6,7,8,9,10], 2)