function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5, 2));
// expected output: 10

console.log(multiply(5));
// expected output: 5

function sum(...theArgs) {
  return theArgs.reduce((previous, current) => {
    return previous + current;
  });
}

console.log(sum(1, 2, 3));
// expected output: 6

console.log(sum(1, 2, 3, 4));
// expected output: 10

function sum2(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum2(...numbers));
// expected output: 6

console.log(sum2.apply(null, numbers));
// expected output: 6

console.log('---');
