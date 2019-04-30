import hello from './main-hello';
import * as serviceWorker from '../pwa/serviceWorker';

console.info('[Sync]', 'before');

hello.greet();

console.info('[Sync]', 'after');

// NOTE: for hot reload
// if (module.hot) {
//   module.hot.accept();
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
