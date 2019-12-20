const object1 = {
  a: 'somestring',
  b: 42
};

for (let [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"
// order is not guaranteed

const object2 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.values(object2));
// expected output: Array ["somestring", 42, false]

console.log('---');
