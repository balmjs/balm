const hello = () => import('./hello');

['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(item => {
  import(`./async/${item}`);
});

hello().then(m => {
  m.default.greet();
});

console.log(`I'm home page (Async)`);
