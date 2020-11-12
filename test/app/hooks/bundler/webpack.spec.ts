import { cleanup, runTest } from '../../test';

const targetDir = '.output';
const output = `${targetDir}/js`;

describe('Balm Hooks - webpack', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it(`bundles single js file to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: `${output}/main.js`,
        testHook: (mix: any) => {
          mix.webpack('./src/scripts/index.js', output);
        }
      },
      done
    );
  });

  it(`bundles multiple js files to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: [`${output}/page-a.js`, `${output}/page-b.js`],
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

  it(`bundles js object to the "${output}" directory`, function(done) {
    runTest(
      {
        testCase: `${output}/app.js`,
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

  const terser = {
    mangle: false
  };
  const rename = {
    suffix: ''
  };

  it('minify amd scripts', function(done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.jsmin(['./amd/scripts/*.js'], `${targetDir}/amd/scripts`, {
            terser,
            rename
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
        testHook: (mix: any) => {
          mix.jsmin(['./cmd/scripts/*.js'], `${targetDir}/cmd/scripts`, {
            terser,
            rename
          });
        }
      },
      done
    );
  });

  describe('bundles a non-existent js file', function() {
    before(function() {
      balm.config = {
        useDefaults: false
      };
    });

    it('init error', function(done) {
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
