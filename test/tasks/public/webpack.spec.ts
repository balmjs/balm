import WebpackTask from '../../../packages/balm-core/src/tasks/public/webpack';

describe('Webpack Task', function () {
  let webpackTask: any;

  describe('default', function () {
    before(function () {
      balm.config = {
        scripts: {
          entry: './src/scripts/index.js'
        }
      };

      webpackTask = new WebpackTask();
    });

    const defaultInput = './src/scripts/index.js';

    it(`expected output: "${defaultInput}"`, function (done) {
      webpackTask.fn(done);

      expect(webpackTask.input).to.equal(defaultInput);
    });
  });

  describe('inject html', function () {
    describe('one entry', function () {
      before(function () {
        balm.config = {
          scripts: {
            entry: {
              index: './src/scripts/index.js'
            },
            injectHtml: true
          }
        };

        webpackTask = new WebpackTask();
      });

      const defaultInput = './src/scripts/index.js';

      it(`expected output: "${defaultInput}"`, function (done) {
        webpackTask.fn(done);

        expect(webpackTask.input).to.equal(defaultInput);
      });
    });

    describe('multi entries', function () {
      before(function () {
        balm.config = {
          scripts: {
            entry: {
              'page-a': './src/scripts/page-a.js',
              'page-b': './src/scripts/page-b.js'
            },
            injectHtml: true,
            htmlPluginOptions: {
              template: './src/templates/default.html'
            }
          }
        };

        webpackTask = new WebpackTask();
      });

      const defaultInput = './src/scripts/index.js';

      it(`expected output: "${defaultInput}"`, function (done) {
        webpackTask.fn(done);

        expect(webpackTask.input).to.equal(defaultInput);
      });
    });
  });

  describe('#mix.webpack()', function () {
    before(function () {
      balm.config = {
        logs: {
          level: 2
        }
      };

      webpackTask = new WebpackTask();
    });

    const defaultInput = './src/scripts/index.js';
    const defaultOutput = 'dist/js';

    it(`expected output: "${defaultInput}"`, function (done) {
      webpackTask.recipe(defaultInput, defaultOutput, {}, function () {
        console.log('sync wxss');
      })(done);

      expect(webpackTask.input).to.equal(defaultInput);
      expect(webpackTask.output).to.equal(defaultOutput);
    });
  });
});
