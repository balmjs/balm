import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import utility1 from './utility1';
import utility2 from './utility2';

console.info('pageA: jquery + lodash + moment + utility1 + utility2');

let width = $(window).width();
let a = _.defaults({ a: 1 }, { a: 3, b: 2 });
let b = _.partition([1, 2, 3, 4], n => n % 2);
let now = moment().format('MMMM Do YYYY, h:mm:ss a');
let week = moment().format('dddd');
console.log(`window width: ${width}`);
console.log(`defaults: ${a}`);
console.log(`partition: ${b}`);
console.log(`now: ${now}`);
console.log(`week: ${week}`);

utility1();
utility2();
