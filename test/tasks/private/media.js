import MediaTask from '../../../lib/tasks/private/media';

describe('Media Task', () => {
  it('generate media', done => {
    const task = new MediaTask();
    const test = balm.config.isProd
      ? 'dist/web/e/big_buck_bunny.mp4'
      : '.tmp/e/big_buck_bunny.mp4';

    runTask({
      task,
      test,
      done
    });
  });
});
