import CssTask from '../../../lib/tasks/public/css';

describe('Css Task', () => {
  it('compiles css files to the .tmp/dist directory', done => {
    let input = './src/styles/main.css';

    const task = new CssTask(input);
    const test = balm.config.production
      ? 'dist/web/a/main.css'
      : '.tmp/a/main.css';

    runTask({
      task,
      test,
      done
    });
  });

  it('compiles css files to a custom directory and file name', done => {
    let input = './src/styles/main.css';
    let output = '.compile/css';

    const task = new CssTask(input, output);
    const test = `${output}/main.css`;

    runTask({
      task,
      test,
      done
    });
  });
});
