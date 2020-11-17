import { cleanup, runTest } from '../test';

const targetDir = '.output';
const output = `${targetDir}/js`;

describe('Balm Hooks - webpack', function () {
  before(function () {
    balm.config = {
      useDefaults: false
    };
  });

  after(function () {
    cleanup();
  });

  describe('bundles js file(s)', function () {
    it(`bundles single js file to the "${output}" directory`, function (done) {
      runTest(
        {
          testCase: `${output}/main.js`,
          testHook: (mix: any) => {
            mix.webpack('./src/scripts/index.js', output);
          }
        },
        done
      );
    });

    it(`bundles multiple js files to the "${output}" directory`, function (done) {
      runTest(
        {
          testCase: [`${output}/page-a.js`, `${output}/page-b.js`],
          testHook: (mix: any) => {
            mix.webpack(
              ['./src/scripts/page-a.js', './src/scripts/page-b.js'],
              output
            );
          }
        },
        done
      );
    });

    it(`bundles js object to the "${output}" directory`, function (done) {
      runTest(
        {
          testCase: `${output}/app.js`,
          testHook: (mix: any) => {
            mix.webpack(
              {
                app: './src/scripts/index.js'
              },
              output
            );
          }
        },
        done
      );
    });
  });

  describe('bundles a non-existent js file', function () {
    it('init error', function (done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.webpack('./undefined.js', output);
          }
        },
        done
      );
    });
  });
});
