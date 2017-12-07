import '../styles/page-a.css';
import $ from 'jquery';
import _ from 'lodash';

console.info(`I'm page A, use jQuery and lodash`);

function test() {
  let width = $(window).width();

  let a = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
  // → { 'a': 1, 'b': 2 }
  let b = _.partition([1, 2, 3, 4], n => n % 2);
  // → [[1, 3], [2, 4]]

  console.log(`window width: ${width}`);
  console.log('defaults: ', a);
  console.log('partition: ', b);
}

test();
