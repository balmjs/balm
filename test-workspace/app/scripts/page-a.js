// Automatic
// import $ from 'jquery';

// Manual
const $ = window.$;

console.log(`I'm page A, use jQuery`);

function test() {
  let width = $(window).width();
  console.log(`window width: ${width}`);
}

test();
