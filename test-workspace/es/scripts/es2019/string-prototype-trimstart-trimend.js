// String.prototype.trimStart
(function () {
  const greeting = '   Hello world!   ';

  console.log(greeting);
  // expected output: "   Hello world!   ";

  console.log(greeting.trimStart());
  // expected output: "Hello world!   ";
})();

// String.prototype.trimEnd
(function () {
  const greeting = '   Hello world!   ';

  console.log(greeting);
  // expected output: "   Hello world!   ";

  console.log(greeting.trimEnd());
  // expected output: "   Hello world!";
})();

console.log('---');
