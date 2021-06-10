import JsminTask from '../../../packages/balm-core/src/tasks/public/jsmin';
import utils from '../../../packages/balm-core/src/utilities/utils';

describe('Jsmin Task', function () {
  let jsminTask: any;

  beforeEach(function () {
    jsminTask = new JsminTask();
  });

  describe('default', function () {
    it('noop', function (done) {
      jsminTask.fn(done);
    });
  });

  describe('#mix.jsmin()', function () {
    const defaultInput = 'src/main.js';
    const defaultOutput = 'dist';

    describe('!options', function () {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function () {
          jsminTask.recipe(defaultInput, defaultOutput)();

          expect(jsminTask.input).to.equal(
            node.path.join(balm.config.workspace, defaultInput)
          );
          expect(jsminTask.output).to.equal(
            node.path.join(balm.config.workspace, defaultOutput)
          );
        })
      );
    });

    describe('options', function () {
      const defaultOptions = {
        ecma: 5,
        parse: {
          ecma: 2017
        },
        compress: {
          comparisons: false,
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          comments: false,
          ascii_only: true
        }
      };
      const customOptions = {
        compress: {
          drop_console: false
        }
      };

      it(
        `expected output: "${JSON.stringify(
          utils.deepMerge(defaultOptions, customOptions)
        )}"`,
        asyncCase(function () {
          jsminTask.recipe(defaultInput, defaultOutput, {
            terser: customOptions
          })();

          expect(JSON.stringify(jsminTask.options)).to.equal(
            JSON.stringify(utils.deepMerge(defaultOptions, customOptions))
          );
        })
      );
    });
  });
});
