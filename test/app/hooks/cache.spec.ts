import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - versioning / cache busting', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it('cache css file', function(done) {
    const input = 'src/compress/file.css';
    const output = `${targetDir}/cache`;

    runTest(
      {
        testCase: isWin ? false : `${output}/file.c06d4b3a.css`,
        testHook: (mix: any) => {
          mix.version(input, output);
        }
      },
      done
    );
  });

  it('cache js file', function(done) {
    const input = 'src/compress/file.js';
    const output = `${targetDir}/cache`;

    runTest(
      {
        testCase: isWin ? false : `${output}/file.2dd0a806.js`,
        testHook: (mix: any) => {
          mix.version(input, output);
        }
      },
      done
    );
  });
});
