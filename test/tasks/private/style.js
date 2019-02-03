import StyleTask from '../../../lib/tasks/private/style';
import CssTask from '../../../lib/tasks/public/css';

describe('Style Task', () => {
  it('generate css', done => {
    const task = new StyleTask();
    const test = balm.config.isProd
      ? 'dist/web/a/main.css'
      : ['.tmp/a/main.css', '.tmp/a/main.css.map'];

    runTask({
      task: new CssTask(),
      test: () => {
        runTask({
          task,
          test,
          done
        });
      }
    });
  });
});
