var arr1 = [1, 2, [3, 4]];
console.log(arr1.flat());
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
console.log(arr2.flat());
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
console.log(arr3.flat(2));
// [1, 2, 3, 4, 5, 6]

let arr4 = ["it's Sunny in", '', 'California'];

arr4.map(x => x.split(' '));
// [["it's", "Sunny", "in"], [""], ["California"]]

arr4.flatMap(x => x.split(' '));
// ["it's", "Sunny", "in", "", "California"]

console.log('---');
