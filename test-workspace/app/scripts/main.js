import hello from './hello';
// const hello = () => import('./hello');

// sync component
hello.greet();

// async component
// hello().then(m => {
//   m.default.greet();
// });

console.log('I\'m home page');
