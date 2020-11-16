import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - rollup', function () {
  after(function () {
    cleanup();
  });

  const output = `${targetDir}/js`;

  describe('in development', function () {
    before(function () {
      balm.config = {
        useDefaults: false,
        scripts: {
          bundler: 'rollup'
        }
      };
    });

    it('build single library', function (done) {
      runTest(
        {
          testCase: `${output}/bundle.js`,
          testHook: (mix: any) => {
            mix.rollup(
              {
                input: {
                  bundle: 'lib/main.js'
                }
              },
              {
                name: 'howLongUntilLunch',
                dir: output,
                format: 'umd'
              }
            );
          }
        },
        done
      );
    });
  });

  describe('in production', function () {
    before(function () {
      balm.config = {
        useDefaults: false,
        env: {
          isProd: true
        },
        scripts: {
          bundler: 'rollup'
        }
      };
    });

    it('build multiple libraries', function (done) {
      runTest(
        {
          testCase: [`${output}/bundle.cjs.js`, `${output}/bundle.esm.js`],
          testHook: (mix: any) => {
            mix.rollup(
              {
                input: 'lib/main.js',
                external: ['ms']
              },
              [
                {
                  file: `${output}/bundle.cjs.js`,
                  format: 'cjs',
                  exports: 'auto'
                },
                { file: `${output}/bundle.esm.js`, format: 'es' }
              ]
            );
          }
        },
        done
      );
    });
  });

  describe('plugins', function () {
    before(function () {
      balm.config = {
        useDefaults: false,
        scripts: {
          bundler: 'rollup',
          inputOptions: {
            plugins: [
              {
                name: 'hi'
              }
            ]
          }
        }
      };
    });

    it('for custom plugins', function (done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.rollup(
              {
                input: {
                  bundle: 'lib/main.js'
                },
                plugins: [
                  {
                    name: 'hello'
                  }
                ]
              },
              {
                dir: output,
                format: 'umd',
                plugins: [
                  {
                    name: 'world'
                  }
                ]
              }
            );
          }
        },
        {
          done,
          delay: 4000
        }
      );
    });
  });
});
