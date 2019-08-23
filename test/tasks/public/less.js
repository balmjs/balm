import LessTask from '../../../lib/tasks/public/less';

describe('Less Task', () => {
  it('compiles less files to the .tmp/dist directory', done => {
    let input = './spa/styles/main.less';

    const task = new LessTask(input);
    const test = balm.config.isProd ? 'dist/web/a/main.css' : '.tmp/a/main.css';

    runTask({
      task,
      test,
      done
    });
  });

  it('compiles less files to a custom directory and file name', done => {
    let input = './spa/styles/main.less';
    let output = '.compile/less';

    const task = new LessTask(input, output);
    const test = `${output}/main.css`;

    runTask({
      task,
      test,
      done
    });
  });
});
