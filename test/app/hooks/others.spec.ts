import { cleanup, runTest } from '../test';

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

  it(`mix.env.isDev, expected output: true`, function(done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          console.log('isDev: ', mix.env.isDev);
        }
      },
      done
    );
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
