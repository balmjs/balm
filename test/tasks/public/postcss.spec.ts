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
          minify: true
        }
      };
    });

    const defaultInput = [
      path.join('css', '/*.css')
    ];
    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        postcssTask.recipe(defaultInput, defaultOutput)();

        expect(JSON.stringify(postcssTask.input)).to.equal(
          JSON.stringify([
            path.join(balm.config.workspace, 'css', '/*.css')
          ])
        );
        expect(postcssTask.output).to.equal(path.join(balm.config.workspace, defaultOutput));
      })
    );
  });
});
