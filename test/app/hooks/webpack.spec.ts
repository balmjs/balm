import { cleanup, runTest } from '../test';

const targetDir = '.output';
const output = `${targetDir}/js`;

describe('Balm Hooks - webpack', function () {
  beforeEach(function () {
    balm.config = {
      useDefaults: false
    };
  });

  after(function () {
    cleanup();
  });

  describe('bundles single js file', function () {
    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          testCase: false, // `${output}/main.js`,
          testHook: (mix: any) => {
            mix.webpack('./src/scripts/index.js', output);
          }
        },
        done
      );
    });
  });

  describe('bundles multiple js files', function () {
    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          testCase: false, // [`${output}/page-a.js`, `${output}/page-b.js`],
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
  });

  describe('bundles object js files', function () {
    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          testCase: false, // `${output}/app.js`,
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
