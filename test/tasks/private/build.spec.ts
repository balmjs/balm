import BuildTask from '../../../src/tasks/private/build';

describe('build task', function() {
  let buildTask: any;

  before(function() {
    balm.config = {
      env: {
        isProd: true
      }
    };

    buildTask = new BuildTask();
    buildTask.fn();
  });

  const defaultInput = `${balm.config.roots.target}/**/*`;

  it(
    `expected output: "${defaultInput}"`,
    asyncCase(function() {
      expect(buildTask.input).to.equal(defaultInput);
    })
  );
});
