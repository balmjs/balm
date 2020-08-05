import PostcssTask from '../../../packages/balm-core/src/tasks/public/postcss';

describe('Postcss Task', function() {
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

    const defaultInput = path.join(balm.config.workspace, 'src', 'styles', '**', '!(_*).css');

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
        env: {
          isDev: true
        },
        styles: {
          extname: 'css',
          minified: true
        }
      };
    });

    const defaultInput = [
      path.join(balm.config.workspace, 'css', '/*.css')
    ];
    const defaultOutput = path.join(balm.config.workspace, 'dist');

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
