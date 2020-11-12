import { runTest } from '../test';
import './bundler/webpack.spec';
import './bundler/rollup.spec';
import './bundler/esbuild.spec';

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
