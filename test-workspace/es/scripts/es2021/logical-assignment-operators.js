// Logical OR assignment (||=)
(function () {
  const a = { duration: 50, title: '' };

  a.duration ||= 10;
  console.log(a.duration);
  // expected output: 50

  a.title ||= 'title is empty.';
  console.log(a.title);
  // expected output: "title is empty"
})();

// Logical AND assignment (&&=)
(function () {
  let a = 1;
  let b = 0;

  a &&= 2;
  console.log(a);
  // expected output: 2

  b &&= 2;
  console.log(b);
  // expected output: 0
})();

// Logical nullish assignment (??=)
(function () {
  const a = { duration: 50 };

  a.duration ??= 10;
  console.log(a.duration);
  // expected output: 50

  a.speed ??= 25;
  console.log(a.speed);
  // expected output: 25
})();

console.log('---');
