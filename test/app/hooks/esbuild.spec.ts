import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - esbuild', function() {
  after(function() {
    cleanup();
  });

  const output = `${targetDir}/js`;

  describe('running a build', function() {
    beforeEach(function() {
      balm.config = {
        useDefaults: false,
        env: {
          isProd: true
        },
        scripts: {
          bundler: 'esbuild'
        }
      };
    });

    it('use esbuild with error', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.esbuild('./src/scripts/index.js', output, {
              splitting: true
            });
          }
        },
        done
      );
    });
  });

  describe('transforming a file', function() {
    describe('in development', function() {
      before(function() {
        balm.config = {
          useDefaults: false,
          scripts: {
            bundler: 'esbuild',
            useTransform: true
          }
        };
      });

      it('use custom build', function(done) {
        runTest(
          {
            testCase: false,
            testHook: (mix: any) => {
              mix.esbuild([
                './src/scripts/page-a.js',
                './src/scripts/page-b.js',
                './src/scripts/page-c.js' // Invalid entry
              ], output, {
                target: 'es2015'
              });
            }
          },
          done
        );
      });
    });
  });

  describe('in production', function() {
    before(function() {
      balm.config = {
        useDefaults: false,
        env: {
          isProd: true
        },
        scripts: {
          bundler: 'esbuild',
          useTransform: true
        }
      };
    });

    it('use custom build', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.esbuild([
              './src/scripts/page-a.js',
              './src/scripts/page-b.js',
              './src/scripts/page-c.js' // Invalid entry
            ], output, {
              target: 'es2015'
            });
          }
        },
        done
      );
    });
  });
});
