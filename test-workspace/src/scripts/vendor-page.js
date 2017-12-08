import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';

let width = $(window).width();

let a = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
// → { 'a': 1, 'b': 2 }
let b = _.partition([1, 2, 3, 4], n => n % 2);
// → [[1, 3], [2, 4]]

console.log(`window width: ${width}`);
console.log('defaults: ', a);
console.log('partition: ', b);

let height = $(document).height();

let now = moment().format('MMMM Do YYYY, h:mm:ss a'); // September 4th 2017, 9:53:03 am
let week = moment().format('dddd'); // Monday

console.log(`document height: ${height}`);
console.log('now: ', now);
console.log('week: ', week);
