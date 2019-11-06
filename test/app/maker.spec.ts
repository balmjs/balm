import { cleanup, runTest } from './test';

describe('Maker', function() {
  after(function() {
    cleanup();
  });

  describe('blacklist in production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    it('expected output: "WARNING"', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.serve();
          }
        },
        done
      );
    });
  });

  describe('blacklist in development', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        },
        useDefaults: false
      };
    });

    it('expected output: "WARNING"', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.publish();
          }
        },
        done
      );
    });
  });
});
