import LintTask from '../../../packages/balm-core/src/tasks/private/lint';

describe('Lint Task', function () {
  let lintTask: any;

  beforeEach(function () {
    lintTask = new LintTask();
    lintTask.fn();
  });

  describe('JS lint', function () {
    const defaultOutput = path.join(balm.config.workspace, 'src', 'scripts');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(lintTask.output).to.equal(defaultOutput);
      })
    );
  });
});
