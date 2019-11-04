import LintTask from '../../../src/tasks/private/lint';

describe('Lint Task', function() {
  let lintTask: any;

  beforeEach(function() {
    lintTask = new LintTask();
    lintTask.fn();
  });

  describe('JS lint', function() {
    const defaultOutput = path.join('src', 'scripts');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(lintTask.output).to.equal(defaultOutput);
      })
    );
  });
});
