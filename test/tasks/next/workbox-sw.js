import WorkboxSwTask from '../../../lib/tasks/next/workbox-sw';

describe('Workbox-sw Task', () => {
  it('Set `workbox-sw.js`', done => {
    const task = new WorkboxSwTask();
    const test = balm.config.isProd
      ? 'dist/workbox-sw.js'
      : '.tmp/workbox-sw.js';

    runTask({
      task,
      test,
      done
    });
  });
});
