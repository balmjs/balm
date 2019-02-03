import JsMinTask from '../../../lib/tasks/public/jsmin';

describe('JsMin Task', () => {
  it('minify js file to a custom directory', done => {
    let input = ['./src/scripts/cmd/*.js'];
    let output = '.compile/cmd';
    let options = {
      mangle: false
    };

    const task = new JsMinTask(input, output, options);
    const test = [`${output}/main.min.js`, `${output}/spinning.min.js`];

    runTask({
      task,
      test,
      done
    });
  });
});
