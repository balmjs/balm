import { cleanup, runTest } from '../test';

describe('Balm Hooks - pwa', function () {
  after(function () {
    cleanup();
  });

  describe('#mix.generateSW()', function () {
    before(function () {
      balm.config = {
        env: {
          isDev: true
        },
        useDefaults: false
      };
    });

    const output = '.tmp/sw.js';

    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          // TODO: Service worker generation failed:
          // Error: Couldn't find configuration for either precaching or runtime caching.
          // Please ensure that the various glob options are set to match one or more files,
          // and/or configure the runtimeCaching option.
          testCase: false,
          testHook: (mix: any) => {
            mix.generateSW();
          }
        },
        done
      );
    });
  });

  describe('#mix.injectManifest()', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        },
        useDefaults: false
      };
    });

    const output = 'dist/sw.js';

    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          testCase: output,
          testHook: (mix: any) => {
            mix.injectManifest({
              swSrc: path.join(
                balm.config.workspace,
                'pwa',
                'service-worker.js'
              ),
              globIgnores: ['test.js']
            });
          }
        },
        done
      );
    });
  });
});
