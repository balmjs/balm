// Pseudo-code of Array
class MainArray {
  constructor(...args) {
    /* ... */
  }
  static [Symbol.create]() {
    // Install special [[DefineOwnProperty]]
    // to magically update 'length'
  }
}

// User code of Array subclass
class MyArray extends MainArray {
  constructor(...args) {
    super(...args);
  }
}

// Two-phase 'new':
// 1) Call @@create to allocate object
// 2) Invoke constructor on new instance
var arr = new MyArray();
arr[1] = 12;
console.log(arr.length === 2);

console.log('---');
