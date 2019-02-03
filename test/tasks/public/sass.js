import SassTask from '../../../lib/tasks/public/sass';

describe('Sass Task', () => {
  it('compiles sass files to the .tmp/dist directory', done => {
    let input = './src/styles/main.scss';

    const task = new SassTask(input);
    const test = balm.config.isProd ? 'dist/web/a/main.css' : '.tmp/a/main.css';

    runTask({
      task,
      test,
      done
    });
  });

  it('compiles sass files to a custom directory and file name', done => {
    let input = './src/styles/main.scss';
    let output = '.compile/sass';

    const task = new SassTask(input, output);
    const test = `${output}/main.css`;

    runTask({
      task,
      test,
      done
    });
  });
});
