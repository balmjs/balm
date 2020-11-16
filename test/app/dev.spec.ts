import { cleanup, runTest } from './test';

describe('App Test in development', function () {
  before(function () {
    balm.config = {
      env: {
        isDev: true
      }
    };
  });

  after(function () {
    cleanup();
  });

  const testCase = [
    '.tmp/index.html',
    '.tmp/css/main.css',
    '.tmp/js/main.js',
    '.tmp/js/modernizr.js'
  ];

  it('expected output: ".tmp"', function (done) {
    runTest(
      {
        testCase,
        testHook: () => {}
      },
      done
    );
  });
});
