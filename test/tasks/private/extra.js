import ExtraTask from '../../../lib/tasks/private/extra';

describe('Extra Task', () => {
  it('generate extra files in root directory', done => {
    const task = new ExtraTask();
    const test = 'dist/favicon.ico';

    runTask({
      task,
      test,
      done
    });
  });
});
