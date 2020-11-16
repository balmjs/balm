import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - zip', function () {
  after(function () {
    cleanup();
  });

  if (!isWin) {
    describe('#mix.zip() with default', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          logs: {
            level: 2
          }
        };
      });

      it(`expected output: "archive.zip"`, function (done) {
        runTest(
          {
            testCase: 'archive.zip',
            testHook: (mix: any) => {
              mix.zip();
            }
          },
          {
            done,
            delay: 4000
          }
        );
      });
    });
  }

  describe('#mix.zip() with custom', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    let input = ['src/compress/*', 'src/copy/**/*'];
    let output = `${targetDir}/new-archive.zip`;

    it(`expected output: "${output}"`, function (done) {
      runTest(
        {
          testCase: output,
          testHook: (mix: any) => {
            mix.zip(input, targetDir, 'new-archive.zip');
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
