import JsTask from '../../../lib/tasks/public/js';

describe('Js Task', () => {
  it('bundles js file to the .tmp/dist directory', done => {
    let input = './src/scripts/spa/main-sync.js';

    const task = new JsTask(input);
    const test = balm.config.isProd ? 'dist/web/b/main.js' : '.tmp/b/main.js';

    runTask({
      task,
      test,
      done
    });
  });

  it('bundles js file to a custom directory', done => {
    let input = './src/scripts/spa/main-sync.js';
    let output = '.compile/js';

    const task = new JsTask(input, output);
    const test = `${output}/main.js`;

    runTask({
      task,
      test,
      done
    });
  });
});
