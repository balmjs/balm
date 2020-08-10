import UrlTask from '../../../packages/balm-core/src/tasks/public/url';

describe('Url Task', function() {
  let urlTask: any;

  beforeEach(function() {
    urlTask = new UrlTask();
  });

  describe('development', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        },
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, '.tmp', 'css');
    const defaultInput = path.join(defaultOutput, '**', '*.css');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        urlTask.fn();

        expect(urlTask.output).to.equal(defaultOutput);
        expect(urlTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        },
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, 'dist', 'css');
    const defaultInput = path.join(defaultOutput, '**', '*.css');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        urlTask.fn();

        expect(urlTask.output).to.equal(defaultOutput);
        expect(urlTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('#mix.url()', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultOutput = 'dist';
    const defaultInput = path.join(defaultOutput, '**', '*.css');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        urlTask.recipe(defaultInput, defaultOutput)();

        expect(urlTask.output).to.equal(path.join(balm.config.workspace, defaultOutput));
        expect(urlTask.input).to.equal(path.join(balm.config.workspace, defaultInput));
      })
    );
  });
});
