import LintTask from '../../../src/tasks/private/lint';

describe('lint task', function() {
  let lintTask: any;

  beforeEach(function() {
    lintTask = new LintTask();
    lintTask.fn();
  });

  describe('JS lint', function() {
    const defaultOutput = 'src/scripts';

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(lintTask.output).to.equal(defaultOutput);
      })
    );
  });
});
