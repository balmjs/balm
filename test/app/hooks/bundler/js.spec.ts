import { runTest } from '../../test';

describe('Balm Hooks - js', function () {
  it('#mix.js()', function(done) {
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
});
