import balm from '../src';
import { expect } from 'chai';

// import balmConfig from '../test-workspace/config/test';
// import { isObject, isArray, isFunction } from '../lib/utilities';

global.balm = balm;
global.balmConfigDefaults = balm.config;
global.expect = expect;
// global.balmConfig = balmConfig;
// global.workspace = balmConfig.workspace;

function asyncCase(fn: Function) {
  return function(done: Function) {
    try {
      fn();
      done();
    } catch (err) {
      done(err);
    }
  };
}

global.asyncCase = asyncCase;

// const DELAY = 4000;

// const shouldExist = (file, contents) => {
//   let path = `${workspace}/${file}`;
//   let result;

//   if (contents) {
//     result = fs.readFileSync(file, { encoding: 'utf8' });
//     result.should.eql(contents);
//   } else {
//     result = fs.existsSync(path);
//     result.should.be.true;
//   }
// };

// const shouldNoExist = file => {
//   let path = `${workspace}/${file}`;
//   let result = fs.existsSync(path);
//   result.should.be.false;
// };

// global.runTask = ({ task, test, done }, result = true) => {
//   gulp.series(isObject(task) ? task.fn : task)();

//   setTimeout(
//     () => {
//       if (isFunction(test)) {
//         test();
//       } else {
//         if (isArray(test)) {
//           test.forEach(file => {
//             result ? shouldExist(file) : shouldNoExist(file);
//           });
//         } else {
//           result ? shouldExist(test) : shouldNoExist(test);
//         }

//         done();
//       }
//     },
//     task === 'default' ? DELAY * 2 : DELAY
//   );
// };
