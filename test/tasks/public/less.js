import LessTask from '../../../lib/tasks/public/less';

describe('Less Task', () => {
  it('compiles less files to the .tmp/dist directory', done => {
    let input = './src/styles/main.less';

    const lessTask = new LessTask(input);
    const task = gulp.series(lessTask.fn);
    const test = () => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }
    };

    runTask(task, test, done);
  });

  it('compiles less files to a custom directory and file name', done => {
    let input = './src/styles/main.less';
    let output = '.compile/less';

    const lessTask = new LessTask(input, output);
    const task = gulp.series(lessTask.fn);
    const test = () => {
      shouldExist(`${output}/main.css`);
    };

    runTask(task, test, done);
  });
});
