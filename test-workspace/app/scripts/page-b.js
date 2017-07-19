// Automatic
// import $ from 'jquery';
// import _ from 'lodash';

// Manual
const $ = window.$;
const _ = window._;

console.log(`I'm page B, use jQuery and lodash`);

function test() {
  let height = $(window).height();
  console.log(`window height: ${height}`);

  let a = _.defaults({a: 1}, {a: 3, b: 2});
  // → { 'a': 1, 'b': 2 }

  let b = _.partition([1, 2, 3, 4], n => n % 2);
  // → [[1, 3], [2, 4]]

  console.log('defaults', a);
  console.log('partition', b);
}

test();
