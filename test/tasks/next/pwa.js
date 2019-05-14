import PwaTask from '../../../lib/tasks/next/pwa';

describe('Pwa Task', () => {
  it('Generated `sw.js`', done => {
    const task = new PwaTask();
    const test = balm.config.isProd ? 'dist/sw.js' : '.tmp/sw.js';

    runTask({
      task,
      test,
      done
    });
  });
});
