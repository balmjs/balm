import ScriptTask from '../../../lib/tasks/private/script';

describe('Script Task', () => {
  it('generate js', done => {
    const task = new ScriptTask();
    const test = 'dist/web/b/main.js';

    runTask({
      task,
      test,
      done
    });
  });
});
