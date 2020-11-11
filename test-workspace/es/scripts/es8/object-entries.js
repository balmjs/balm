// Object.values
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.values(object1));
// expected output: Array ["somestring", 42, false]

// Object.entries
const object2 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object2)) {
  console.log(`${key}: ${value}`);
}
// expected output:
// "a: somestring"
// "b: 42"
// order is not guaranteed

console.log('---');
