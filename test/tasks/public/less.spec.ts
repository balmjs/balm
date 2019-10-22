import LessTask from '../../../src/tasks/public/less';

describe('less task', function() {
  let lessTask: any;

  beforeEach(function() {
    lessTask = new LessTask();
  });

  describe('default', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'less'
        }
      };
    });

    const defaultInput = 'src/styles/**/!(_*).less';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        lessTask.fn();

        expect(lessTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('hook', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'less'
        }
      };
    });

    const defaultInput = ['less/*.less'];
    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        lessTask.recipe(defaultInput, defaultOutput, {})();

        expect(JSON.stringify(lessTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(lessTask.output).to.equal(defaultOutput);
      })
    );
  });
});
