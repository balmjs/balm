import CssTask from '../../../lib/tasks/public/css';

describe('Css Task', () => {
  it('compiles css files to the .tmp/dist directory', done => {
    let input = './src/styles/main.css';

    const cssTask = new CssTask(input);
    const task = gulp.series(cssTask.fn);
    const test = () => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }
    };

    runTask(task, test, done);
  });

  it('compiles css files to a custom directory and file name', done => {
    let input = './src/styles/main.css';
    let output = '.compile/css';

    const cssTask = new CssTask(input, output);
    const task = gulp.series(cssTask.fn);
    const test = () => {
      shouldExist(`${output}/main.css`);
    };

    runTask(task, test, done);
  });
});
