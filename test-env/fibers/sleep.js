var Fiber = require('fibers');

function sleep(ms) {
  var fiber = Fiber.current;
  setTimeout(function () {
    fiber.run();
  }, ms);
  Fiber.yield();
}

Fiber(function () {
  console.log('wait... ' + new Date());
  sleep(1000);
  console.log('ok... ' + new Date());
  console.log();
}).run();
console.log('back in main');

// $ node sleep.js
// wait... Fri Jan 21 2011 22:42:04 GMT+0900 (JST)
// back in main
// ok... Fri Jan 21 2011 22:42:05 GMT+0900 (JST)
