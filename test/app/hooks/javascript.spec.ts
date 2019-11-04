import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - javascript', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  const output = `${targetDir}/js`;

  it(`bundles js file to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: `${output}/main.js`,
        hook: (mix: any) => {
          mix.js('./src/scripts/index.js', output);
        }
      },
      done
    );
  });

  it(`bundles js files to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: [`${output}/page-a.js`, `${output}/page-b.js`],
        hook: (mix: any) => {
          mix.js(
            ['./src/scripts/page-a.js', './src/scripts/page-b.js'],
            output
          );
        }
      },
      done
    );
  });

  it(`bundles js object to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: `${output}/app.js`,
        hook: (mix: any) => {
          mix.js(
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

  it('minify amd scripts', function(done) {
    runTest(
      {
        testCase: false,
        hook: (mix: any) => {
          mix.jsmin(['./amd/scripts/*.js'], `${targetDir}/amd/scripts`, {
            terserOptions: {
              mangle: false
            },
            renameOptions: {
              suffix: ''
            }
          });
        }
      },
      done
    );
  });

  it('minify cmd scripts', function(done) {
    runTest(
      {
        testCase: false,
        hook: (mix: any) => {
          mix.jsmin(['./cmd/scripts/*.js'], `${targetDir}/cmd/scripts`, {
            terserOptions: {
              mangle: false
            },
            renameOptions: {
              suffix: ''
            }
          });
        }
      },
      done
    );
  });
});
