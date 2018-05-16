import $ from 'jquery';
import _ from 'lodash';
import utility2 from './utility2';
import utility3 from './utility3';

console.info('pageB: jquery + lodash + utility2 + utility3');

let width = $(window).width();
let a = _.defaults({ a: 1 }, { a: 3, b: 2 });
let b = _.partition([1, 2, 3, 4], n => n % 2);
console.log(`window width: ${width}`);
console.log(`defaults: ${a}`);
console.log(`partition: ${b}`);

utility2();
utility3();
