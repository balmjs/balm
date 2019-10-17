import BuildTask from '../../../src/tasks/private/build';

describe('build task', function() {
  let buildTask: any;

  beforeEach(function() {
    buildTask = new BuildTask();
    buildTask.fn();
  });

  describe('measure size', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultInput = 'dist/**/*';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        expect(buildTask.input).to.equal(defaultInput);
      })
    );
  });
});
