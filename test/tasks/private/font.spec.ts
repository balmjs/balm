import FontTask from '../../../packages/balm-core/src/tasks/private/font';

describe('Font Task', function () {
  let fontTask: any;

  beforeEach(function () {
    fontTask = new FontTask();
    fontTask.fn();
  });

  describe('development', function () {
    before(function () {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, '.tmp', 'font');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(fontTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('production', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultOutput = path.join(balm.config.workspace, 'dist', 'font');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(fontTask.output).to.equal(defaultOutput);
      })
    );
  });
});
