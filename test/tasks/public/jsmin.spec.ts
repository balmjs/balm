import JsminTask from '../../../packages/balm-core/src/tasks/public/jsmin';

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
            path.join(balm.config.workspace, defaultInput)
          );
          expect(jsminTask.output).to.equal(
            path.join(balm.config.workspace, defaultOutput)
          );
        })
      );
    });

    describe('options', function () {
      const defaultOptions = {
        parse: { ecma: 2017 },
        compress: { ecma: 5, comparisons: false, inline: 2 },
        mangle: { safari10: true },
        output: { ecma: 5, comments: false, ascii_only: true }
      };
      const terser = {
        compress: {
          drop_console: false
        }
      };

      it(
        `expected output: "${JSON.stringify(
          Object.assign(defaultOptions, terser)
        )}"`,
        asyncCase(function () {
          jsminTask.recipe(defaultInput, defaultOutput, {
            terser
          })();

          expect(JSON.stringify(jsminTask.options)).to.equal(
            JSON.stringify(Object.assign(defaultOptions, terser))
          );
        })
      );
    });
  });
});
