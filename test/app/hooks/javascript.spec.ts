import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - webpack', function() {
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
        testHook: (mix: any) => {
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
        testHook: (mix: any) => {
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
        testHook: (mix: any) => {
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

  it('bundles a non-existent js file for init error', function(done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.js('./undefined.js', output);
        }
      },
      done
    );
  });
});

describe('Balm Hooks - esbuild', function() {
  after(function() {
    cleanup();
  });

  const output = `${targetDir}/js`;

  describe('running a build', function() {
    beforeEach(function() {
      balm.config = {
        useDefaults: false,
        env: {
          isProd: true
        },
        scripts: {
          esbuild: true
        }
      };
    });

    it('use esbuild with error', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.js('./src/scripts/index.js', output, {
              splitting: true
            });
          }
        },
        done
      );
    });
  });

  describe('transforming a file', function() {
    beforeEach(function() {
      balm.config = {
        useDefaults: false,
        env: {
          isProd: true
        },
        scripts: {
          esbuild: true,
          useTransform: true
        }
      };
    });

    it('use custom build', function(done) {
      runTest(
        {
          testCase: false,
          testHook: (mix: any) => {
            mix.js([
              './src/scripts/page-a.js',
              './src/scripts/page-b.js',
              './src/scripts/page-c.js' // Invalid entry
            ], output, {
              target: 'es2015'
            });
          }
        },
        done
      );
    });
  });
});
