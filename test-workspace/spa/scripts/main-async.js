const hello = () => import('./main-hello');

console.info('[Async]', 'before');

hello().then(m => {
  m.default.greet();
});

['a', 'b', 'c', 'd'].forEach(item => {
  console.log(`Loading ${item}`);
  import(`./async/${item}`);
});

console.info('[Async]', 'after');
