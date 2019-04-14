
// 柯里化
// https://medium.com/@kj_huang/implementation-of-lodash-curry-function-8b1024d71e3b

function curry(targetFn) {
    let numArgs = targetFn.length;
    return function fn() {
        if (arguments.length < numArgs) {
            return fn.bind(null, ...arguments);
        } else {
            return targetFn.apply(null, arguments)
        }
    }
}

var addTen = curry(function(a, b) {
    return a + b;
})(10)

console.log(addTen(2))
console.log(addTen(19))

