import JsMinTask from '../../../lib/tasks/public/jsmin';

describe('JsMin Task', () => {
  it('minify js file to a custom directory', done => {
    let input = ['./src/scripts/cmd/*.js'];
    let output = '.compile/cmd';
    let options = {
      mangle: false
    };

    const jsMinTask = new JsMinTask(input, output, options);
    const task = gulp.series(jsMinTask.fn);
    const test = () => {
      shouldExist(`${output}/main.min.js`);
      shouldExist(`${output}/spinning.min.js`);
    };

    runTask(task, test, done);
  });
});
