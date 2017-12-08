const hello = () => import('./hello');

hello().then(m => {
  m.default.greet();
});

console.log(`I'm home page (Async)`);
