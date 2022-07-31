; (function () {
    let a = 0
    let b = async () => {
        a = a + await 10
        console.log('2', a) // -> '2' 10
    }
    b()
    a++
    console.log('1', a) // -> '1' 1
})()
    ; (function () {
        var a = 0
        var b = () => {
            var temp = a;
            Promise.resolve(10)
                .then((r) => {
                    a = temp + r;
                })
                .then(() => {
                    console.log('2', a)
                })
        }
        b()
        a++
        console.log('1', a)
    })();

; (function () {
    let a = 0;
    let b = async () => {
        a = a + await 10;
        console.log('a1', a)
    }
    b();
    a++;
    console.log('a2', a)
})()
    ; (function () {
        let a = 0;
        let b = () => {
            let tmp = a;
            Promise.resolve(10).then(r => {
                // a = a + r;
                return r
            }).then((r) => {
                a = a + r;
                console.log('d1', a)
            })
            Promise.resolve(10).then(r => {
                a = tmp + r;
                console.log('d4', a)
            }).then(() => {
                console.log('d2', a)
            })
        }
        b();
        a++;
        console.log('d3', a)
    })()
    ; (function () {
        let a = 0;
        let b = async () => {
            let c = await 10;
            a = a + c;
            console.log('c1', a)
        }
        b();
        a++;
        console.log('c2', a)
    })()

    ;(async function(){
        let fn = function(count){
            console.log('start', count)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('done', count)
                    resolve()
                }, 1000)
            })
        }
        console.log(Date.now())
        await fn(1);
        await fn(2);
        await fn(3);
        console.log(Date.now())
        let x = fn(4), y = fn(5), z = fn(6);
        console.log(Date.now())
        await x;
        await y;
        await z;
        console.log(Date.now())
        let l = fn(7), m = fn(8), n = fn(9);
        console.log(Date.now())
        l;m;n;
        console.log(Date.now())
    })();
    function _new(){
        arguments = Array.from(arguments);
        let constructor = Array.from(arguments)[0], 
          args = arguments.slice(1);
        let obj = Object.create(constructor.prototype);
        let res = constructor.apply(obj, args);
        if(res !== null && (typeof res === 'function' || typeof res === 'object')){
            return res
        }  
        return obj
    }