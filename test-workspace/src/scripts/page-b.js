import '../styles/page-b.css';
import $ from 'jquery';
import moment from 'moment';

console.info(`I'm page B, use jQuery and moment`);

function test() {
  let height = $(window).height();

  let now = moment().format('MMMM Do YYYY, h:mm:ss a'); // September 4th 2017, 9:53:03 am
  let week = moment().format('dddd'); // Monday

  console.log(`window height: ${height}`);
  console.log('now: ', now);
  console.log('week: ', week);
}

test();
