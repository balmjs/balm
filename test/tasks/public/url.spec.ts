import UrlTask from '../../../src/tasks/public/url';

describe('postcss task', function() {
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

    const defaultOutput = '.tmp/css';
    const defaultInput = `${defaultOutput}/**/*.css`;

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

    const defaultOutput = 'dist/css';
    const defaultInput = `${defaultOutput}/**/*.css`;

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        urlTask.fn();

        expect(urlTask.output).to.equal(defaultOutput);
        expect(urlTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('hook', function() {
    before(function() {
      balm.config = {
        styles: {
          extname: 'css'
        }
      };
    });

    const defaultOutput = 'dist';
    const defaultInput = `${defaultOutput}/*.css`;

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        urlTask.recipe(defaultInput, defaultOutput)();

        expect(urlTask.output).to.equal(defaultOutput);
        expect(urlTask.input).to.equal(defaultInput);
      })
    );
  });
});
