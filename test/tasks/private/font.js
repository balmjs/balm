import FontTask from '../../../lib/tasks/private/font';

describe('Font Task', () => {
  it('generate fonts', done => {
    const task = new FontTask();
    const test = balm.config.isProd
      ? 'dist/web/d/roboto-regular.woff'
      : '.tmp/fonts/roboto-regular.woff';

    runTask({
      task,
      test,
      done
    });
  });
});
