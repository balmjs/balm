import BuildTask from '../../../packages/balm-core/src/tasks/private/build';

describe('Build Task', function () {
  let buildTask: any;

  beforeEach(function () {
    buildTask = new BuildTask();
    buildTask.fn();
  });

  describe('measure size', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultInput = path.join(balm.config.workspace, 'dist', '**', '*');

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        expect(buildTask.input).to.equal(defaultInput);
      })
    );
  });
});
