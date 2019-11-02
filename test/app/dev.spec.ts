import { cleanup, shouldExist } from './test';

describe('app test', function() {
  before(function() {
    balm.config = {
      env: {
        isDev: true
      }
    };
  });

  after(function() {
    cleanup();
  });

  const testCase = [
    '.tmp/index.html',
    '.tmp/css/main.css',
    '.tmp/js/main.js',
    '.tmp/js/modernizr.js'
  ];

  it('development', function(done) {
    balm.afterTask = function() {
      testCase.forEach((file: string) => {
        shouldExist(file);
      });
    };
    balm.go();

    gulp.series('default')();

    setTimeout(done, 4000);
  });
});
