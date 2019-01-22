import HtmlTask from '../../../lib/tasks/private/html';

describe('Html Task', () => {
  it('generate templates', done => {
    const task = new HtmlTask();
    const test = balm.config.isProd
      ? ['dist/index.html', 'dist/main-sync.html']
      : ['.tmp/index.html', '.tmp/main-sync.html'];

    runTask({
      task,
      test,
      done
    });
  });
});
