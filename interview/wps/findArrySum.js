
/**
 * 给定一个排好序的整数数组，判断其中是否存在两个数之和等于指定的值，
 * 时间复杂度最好能达到O(n)。（例如：[1, 2, 3, 4, 5, 9]，指定值为12，结果为true（3+9））
 * @param {*} arr 
 * @param {*} key 
 */

function isExist(arr, key) {
    let i = 0;
    let j = arr.length-1;

    while (i < j) {
        const sum = arr[i] + arr[j];

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