import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - zip', function() {
  beforeEach(function() {
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
        testCase: `${output}/archive.zip`,
        hook: (mix: any) => {
          mix.zip(input, output);
        }
      },
      done
    );
  });
});
