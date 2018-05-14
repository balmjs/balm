import hello from './hello';

console.info('[Sync]', 'before');

hello.greet();

console.info('[Sync]', 'after');
