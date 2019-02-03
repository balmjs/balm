import ImageTask from '../../../lib/tasks/private/image';

describe('Image Task', () => {
  it('generate images', done => {
    const task = new ImageTask();
    const test = balm.config.isProd
      ? ['dist/web/c/logo.png', 'dist/web/c/logo.svg']
      : ['.tmp/c/logo.png', '.tmp/c/logo.svg'];

    runTask({
      task,
      test,
      done
    });
  });
});
