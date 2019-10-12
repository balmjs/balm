import BuildTask from '../../../src/tasks/private/build';

describe('build task', function() {
  let buildTask: any;

  beforeEach(function() {
    balm.config = {
      env: {
        isProd: true,
        isDev: false
      }
    };
    buildTask = new BuildTask();
  });

  describe('input without init', function() {
    it(
      'expected output: undefined',
      asyncCase(function() {
        expect(buildTask.input).to.equal(undefined);
      })
    );
  });

  describe('input with init', function() {
    const defaultInput = 'dist/**/*';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        buildTask.fn();
        expect(buildTask.input).to.equal(defaultInput);
      })
    );
  });
});
