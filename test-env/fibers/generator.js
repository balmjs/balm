var Fiber = require('fibers');

var inc = Fiber(function (start) {
  var total = start;
  while (true) {
    total += Fiber.yield(total);
  }
});

for (var ii = inc.run(1); ii <= 10; ii = inc.run(1)) {
  console.log(ii);
}

console.log();

// $ node generator.js
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
