import { argv } from 'yargs';
import { title, message } from './config';

const runInDevelopment = Object.keys(argv).length === 2;
const runInProduction =
  Object.keys(argv).length > 2 && (argv.p || argv.production);

if (typeof argv === 'object' && !argv._.length) {
  if (runInDevelopment || runInProduction) {
    require('./balm-go');
  } else {
    console.log(title, message.binCommand);
  }
} else {
  console.log(title, message.binCommand);
}
