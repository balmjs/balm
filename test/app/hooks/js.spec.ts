import { runTest } from '../test';

const targetDir = '.output';
const terser = {
  mangle: false
};
const rename = {
  suffix: ''
};

describe('Balm Hooks - js', function () {
  beforeEach(function () {
    balm.config = {
      useDefaults: false
    };
  });

  it('#mix.js()', function (done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.js();
        }
      },
      done
    );
  });

  it('minify amd scripts', function (done) {
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

  it('minify cmd scripts', function (done) {
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
});
