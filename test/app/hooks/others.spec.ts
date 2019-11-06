import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - others', function() {
  beforeEach(function() {
    balm.config = {
      env: {
        isDev: true
      },
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it('#mix.modernizr()', function(done) {
    runTest(
      {
        testCase: '.tmp/js/modernizr.js',
        testHook: (mix: any) => {
          mix.modernizr();
        }
      },
      done
    );
  });
});
