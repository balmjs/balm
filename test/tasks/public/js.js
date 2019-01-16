import JsTask from '../../../lib/tasks/public/js';

describe('Js Task', () => {
  it('bundles js file to the .tmp/dist directory', done => {
    let input = './src/scripts/main-sync.js';

    const jsTask = new JsTask(input);
    const task = gulp.series(jsTask.fn);
    const test = () => {
      if (balm.config.production) {
        shouldExist('dist/web/b/main.js');
      } else {
        shouldExist('.tmp/b/main.js');
      }
    };

    runTask(task, test, done);
  });

  it('bundles js file to a custom directory', done => {
    let input = './src/scripts/main-sync.js';
    let output = '.compile/js';

    const jsTask = new JsTask(input, output);
    const task = gulp.series(jsTask.fn);
    const test = () => {
      shouldExist(`${output}/main.js`);
    };

    runTask(task, test, done);
  });
});
