
function isExist(arr, key) {
    let i = 0;
    let j = arr.length-1;

    while (i < j) {
        const sum = arr[i] + arr[j];
        // console.log('========')
        // console.log(i)
        // console.log(j)

        if (sum === key) {
            return true;
        } else if (sum > key) {
            j--;
        } else {
            i++;
        }
    }
    return false;
}

var testArr = [1, 2, 3, 4, 5, 9];
console.log(isExist(testArr, 18))

var arr = [];

arr["a"] = (a, b) => a + b;
console.log(arr.length);   // A

arr['2'] = 2;
console.log(arr.length);   // B

console.log(arr)

arr.length = 0;
console.log(arr);          // C
console.log(arr['a'](4, 3))