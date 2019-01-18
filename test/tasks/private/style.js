import StyleTask from '../../../lib/tasks/private/style';
import CssTask from '../../../lib/tasks/public/css';

describe('Style Task', () => {
  it('generate css', done => {
    const task = new StyleTask();
    const test = 'dist/web/a/main.css';

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
