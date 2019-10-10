// import remove from 'rimraf';
// import './tasks';
import { before, describe, it } from 'mocha';
import { assert } from 'chai';

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

// const reset = () => {
//   balm.reset();
//   remove.sync(`${workspace}/copy-dest`);
//   remove.sync(`${workspace}/.tmp`);
//   remove.sync(`${workspace}/.compile`);
//   remove.sync(`${workspace}/dist`);
//   remove.sync(`${workspace}/assets`);
//   remove.sync(`${workspace}/archive.zip`);
// };

// before(function() {
//   // runs before all tests in this block
//   console.log('+++++_____++++');
// });

// beforeEach(() => {

// balm.config = balmConfig;
// balm.config.isProd = false;
// });

// afterEach(() => {
//   reset();
// });

before(function() {
  console.log('+++++_____++++');
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it(
      'should return -1 when not present',
      asyncCase(() => {
        assert.equal([1, 2, 3].indexOf(4), -1);
      })
    );
  });
});
