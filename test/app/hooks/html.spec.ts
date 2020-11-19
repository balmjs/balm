import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - html', function () {
  describe('for web', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    after(function () {
      cleanup();
    });

    it('#mix.html()', function (done) {
      const input = 'src/index.html';
      const output = `${targetDir}/html`;

      runTest(
        {
          testCase: `${output}/index.html`,
          testHook: (mix: any) => {
            mix.html(input, output);
          }
        },
        done
      );
    });
  });

  describe('for desktop', function () {
    before(function () {
      balm.config = {
        useDefaults: false,
        scripts: {
          target: 'electron-main'
        }
      };
    });

    after(function () {
      cleanup();
    });

    it('#mix.html()', function (done) {
      const input = 'src/index.html';
      const output = `${targetDir}/html`;

      runTest(
        {
          testCase: `${output}/index.html`,
          testHook: (mix: any) => {
            mix.html(input, output);
          }
        },
        done
      );
    });
  });
});
