// Array.prototype.flat
(function () {
  const arr1 = [0, 1, 2, [3, 4]];

  console.log(arr1.flat());
  // expected output: [0, 1, 2, 3, 4]

  const arr2 = [0, 1, 2, [[[3, 4]]]];

  console.log(arr2.flat(2));
  // expected output: [0, 1, 2, [3, 4]]
})();

// Array.prototype.flatMap
(function () {
  let arr = [1, 2, 3, 4];

  arr.flatMap((x) => [x, x * 2]);
  // is equivalent to
  arr.reduce((acc, x) => acc.concat([x, x * 2]), []);
  // [1, 2, 2, 4, 3, 6, 4, 8]
})();

console.log('---');
