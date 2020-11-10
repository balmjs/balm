// Proxying a normal object
var target = {};
var handler = {
  get: function(receiver, name) {
    return `Hello, ${name}!`;
  }
};

var p = new Proxy(target, handler);
console.log(p.world === 'Hello, world!');

// Proxying a function object
var target2 = function() {
  return 'I am the target';
};
var handler2 = {
  apply: function(receiver, ...args) {
    return 'I am the proxy';
  }
};

var p2 = new Proxy(target2, handler2);
console.log(p2() === 'I am the proxy');

console.log('---');
