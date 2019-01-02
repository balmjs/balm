import hello from './hello';

console.info('[Sync]', 'before');

hello.greet();

console.info('[Sync]', 'after');

// NOTE: for hot reload
// if (module.hot) {
//   module.hot.accept();
// }
