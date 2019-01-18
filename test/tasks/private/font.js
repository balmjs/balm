import FontTask from '../../../lib/tasks/private/font';

describe('Font Task', () => {
  it('generate fonts', done => {
    const task = new FontTask();
    const test = balm.config.production
      ? 'dist/web/d/roboto-regular.woff'
      : '.tmp/font/roboto-regular.woff';

    runTask({
      task,
      test,
      done
    });
  });
});
