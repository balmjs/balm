import PostcssTask from '../../../src/tasks/public/postcss';

describe('postcss task', function() {
  let postcssTask: any;

  beforeEach(function() {
    postcssTask = new PostcssTask();
  });

  describe('default', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultInput = 'src/styles/**/!(_*).css';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        postcssTask.fn();

        expect(postcssTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('#mix.css()', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultInput = ['css/*.css'];
    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        postcssTask.recipe(defaultInput, defaultOutput)();

        expect(JSON.stringify(postcssTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(postcssTask.output).to.equal(defaultOutput);
      })
    );
  });
});
