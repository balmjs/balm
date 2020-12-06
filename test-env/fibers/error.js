var Fiber = require('fibers');

var fn = Fiber(function () {
  console.log('async work here...');
  Fiber.yield();
  console.log('still working...');
  Fiber.yield();
  console.log('just a little bit more...');
  Fiber.yield();
  throw new Error('oh crap!');
});

try {
  while (true) {
    fn.run();
  }
} catch (e) {
  console.log('safely caught that error!');
  console.log(e.stack);
}
console.log('done!');

// $ node error.js
// async work here...
// still working...
// just a little bit more...
// safely caught that error!
// Error: oh crap!
// 		at error.js:10:9
// done!
