import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - zip', function() {
  before(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it('#mix.zip()', function(done) {
    let input = ['src/compress/*', 'src/copy/**/*'];
    let output = targetDir;

    runTest(
      {
        testCase: `${output}/new-archive.zip`,
        testHook: (mix: any) => {
          mix.zip(input, output, 'new-archive.zip');
        }
      },
      done
    );
  });

  it('#mix.zip() with default', function(done) {
    runTest(
      {
        testCase: 'archive.zip',
        testHook: (mix: any) => {
          mix.zip();
        }
      },
      done
    );
  });
});
