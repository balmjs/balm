import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - stylesheets', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  ['sass', 'less', 'css'].forEach(extname => {
    const api = extname;
    const input = `src/styles/main.${extname === 'sass' ? 'scss' : extname}`;
    const output = `${targetDir}/${extname}`;

    it(`compiles ${
      extname === 'css' ? 'postcss' : extname
    } files to the "${output}" directory`, function(done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          hook: (mix: any) => {
            mix[api](input, output);
          }
        },
        done
      );
    });
  });
});
