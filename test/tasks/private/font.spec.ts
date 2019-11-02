import FontTask from '../../../src/tasks/private/font';

describe('font task', function() {
  let fontTask: any;

  beforeEach(function() {
    fontTask = new FontTask();
    fontTask.fn();
  });

  describe('development', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    const defaultOutput = path.join('.tmp', 'font');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(fontTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultOutput = path.join('dist', 'font');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(fontTask.output).to.equal(defaultOutput);
      })
    );
  });
});
