var Fiber = require('fibers');

// Generator function. Returns a function which returns incrementing
// Fibonacci numbers with each call.
function Fibonacci() {
  // Create a new fiber which yields sequential Fibonacci numbers
  var fiber = Fiber(function () {
    Fiber.yield(0); // F(0) -> 0
    var prev = 0,
      curr = 1;
    while (true) {
      Fiber.yield(curr);
      var tmp = prev + curr;
      prev = curr;
      curr = tmp;
    }
  });
  // Return a bound handle to `run` on this fiber
  return fiber.run.bind(fiber);
}

// Initialize a new Fibonacci sequence and iterate up to 1597
var seq = Fibonacci();
for (var ii = seq(); ii <= 1597; ii = seq()) {
  console.log(ii);
}

console.log();

// $ node fibonacci.js
// 0
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
// 55
// 89
// 144
// 233
// 377
// 610
// 987
// 1597
