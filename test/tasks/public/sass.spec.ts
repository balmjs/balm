import SassTask from '../../../src/tasks/public/sass';

describe('sass task', function() {
  let sassTask: any;

  beforeEach(function() {
    sassTask = new SassTask();
  });

  describe('default', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'scss'
        }
      };
    });

    const defaultInput = 'src/styles/**/!(_*).{scss,sass}';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        sassTask.fn();

        expect(sassTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('#mix.sass()', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'scss'
        }
      };
    });

    const defaultInput = ['sass/*.sass', 'scss/*.scss'];
    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        sassTask.recipe(defaultInput, defaultOutput, {})();

        expect(JSON.stringify(sassTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(sassTask.output).to.equal(defaultOutput);
      })
    );
  });
});
