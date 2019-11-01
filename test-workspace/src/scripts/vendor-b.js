import $ from 'jquery';
import moment from 'moment';

console.info('Loading vender b');

let height = $(document).height();

let now = moment().format('MMMM Do YYYY, h:mm:ss a'); // September 4th 2017, 9:53:03 am
let week = moment().format('dddd'); // Monday

console.log(`document height: ${height}`);
console.log(`now: ${now}`);
console.log(`week: ${week}`);
