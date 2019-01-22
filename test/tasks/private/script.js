import ScriptTask from '../../../lib/tasks/private/script';

describe('Script Task', () => {
  it('generate js', done => {
    const task = new ScriptTask();
    const test = balm.config.isProd ? 'dist/web/b/main.js' : '.tmp/b/main.js';

    runTask({
      task,
      test,
      done
    });
  });
});
