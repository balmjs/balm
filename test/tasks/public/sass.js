import SassTask from '../../../lib/tasks/public/sass';

describe('Sass Task', () => {
  it('compiles sass files to the .tmp/dist directory', done => {
    let input = './src/styles/main.scss';

    const sassTask = new SassTask(input);
    const task = gulp.series(sassTask.fn);
    const test = () => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }
    };

    runTask(task, test, done);
  });

  it('compiles sass files to a custom directory and file name', done => {
    let input = './src/styles/main.scss';
    let output = '.compile/sass';

    const sassTask = new SassTask(input, output);
    const task = gulp.series(sassTask.fn);
    const test = () => {
      shouldExist(`${output}/main.css`);
    };

    runTask(task, test, done);
  });
});
