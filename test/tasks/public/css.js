import CssTask from '../../../lib/tasks/public/css';

describe('Css Task', () => {
  it('compiles css files to the .tmp/dist directory', done => {
    const cssTask = new CssTask();

    const task = gulp.series(cssTask.fn);
    const assertion = () => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main1.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }
    };

    runTask(task, assertion, done);
  });

  // it('compiles css files to a custom directory and file name', () => {
  //   const cssTask = new CssTask();

  //   let input = './src/styles/main.css';
  //   let output = '.compile/css';

  //   cssTask.input = input;
  //   cssTask.output = output;

  //   const task = gulp.series(cssTask.fn);
  //   const done = () => {
  //     shouldExist(`${output}/main2.css`);
  //   };

  //   runTask(task, done);
  // });
});
