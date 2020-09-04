import { argv } from 'yargs';
import { title, message } from './config';

if (argv._[0] === 'go') {
  require('./bootstrap');
} else {
  console.log(title, message.binCommand);
}
