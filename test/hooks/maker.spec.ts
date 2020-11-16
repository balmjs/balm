import { cleanup, runTest } from '../app/test';

describe('Maker', function() {
  after(function() {
    cleanup();
  });

  describe('blocklist in production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        },
        useDefaults: false
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

  describe('blocklist in development', function() {
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
