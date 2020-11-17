import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - html', function () {
  afterEach(function () {
    cleanup();
  });

  describe('for web', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
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
        useDefaults: false
      };

      BalmJS.config.inDesktopApp = true; // specific field
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
