import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - html', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it('#mix.html()', function(done) {
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
