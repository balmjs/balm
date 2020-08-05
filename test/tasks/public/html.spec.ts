import HtmlTask from '../../../packages/balm-core/src/tasks/public/html';

describe('Html Task', function() {
  let htmlTask: any;

  beforeEach(function() {
    htmlTask = new HtmlTask();
    htmlTask.fn();
  });

  describe('development', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, '.tmp');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(htmlTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        },
        assets: {
          cache: false
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, 'dist');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(htmlTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('production with cache', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        },
        assets: {
          cache: true
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, 'dist');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(htmlTask.output).to.equal(defaultOutput);
      })
    );
  });
});
