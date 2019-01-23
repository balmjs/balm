import $ from 'jquery';
import moment from 'moment';
import utility2 from './utility2';
import utility3 from './utility3';

console.info('pageC: jquery + moment + utility2 + utility3');

let width = $(window).width();
let now = moment().format('MMMM Do YYYY, h:mm:ss a');
let week = moment().format('dddd');
console.log(`window width: ${width}`);
console.log(`now: ${now}`);
console.log(`week: ${week}`);

utility2();
utility3();
