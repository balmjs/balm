import WebpackTask from '../../../packages/balm-core/src/tasks/public/webpack';

describe('Webpack Task', function () {
  let webpackTask: any;

  beforeEach(function () {
    webpackTask = new WebpackTask();
  });

  describe('default', function () {
    before(function () {
      balm.config = {
        scripts: {
          entry: './src/scripts/index.js'
        }
      };
    });

    const defaultInput = './src/scripts/index.js';

    it(`expected output: "${defaultInput}"`, function (done) {
      webpackTask.fn(done);

      expect(webpackTask.input).to.equal(defaultInput);
    });
  });

  describe('#mix.webpack()', function () {
    before(function () {
      balm.config = {
        logs: {
          level: 2
        }
      };
    });

    const defaultInput = './src/scripts/index.js';
    const defaultOutput = 'dist/js';

    it(`expected output: "${defaultInput}"`, function (done) {
      webpackTask.recipe(defaultInput, defaultOutput, {})(done);

      expect(webpackTask.input).to.equal(defaultInput);
      expect(webpackTask.output).to.equal(defaultOutput);
    });
  });
});
