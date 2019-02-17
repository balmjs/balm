import VersionTask from '../../../lib/tasks/public/version';
import CopyTask from '../../../lib/tasks/public/copy';
import JsTask from '../../../lib/tasks/public/js';

describe('Version Task', () => {
  it('cache css files', done => {
    let input = '.compile/cache/main.css';
    let output = '.compile/cache';

    const task = new VersionTask(input, output);
    const test = `${output}/main.d0093e89.css`;

    runTask({
      task: new CopyTask('./src/styles/main.css', output),
      test: () => {
        runTask({
          task,
          test,
          done
        });
      }
    });
  });

  it('cache js files', done => {
    let input = '.compile/cache/main.js';
    let output = '.compile/cache';

    const task = new VersionTask(input, output);
    const test = balm.config.isProd
      ? `${output}/main.a15f834f.js`
      : `${output}/main.60f1d5e1.js`;

    runTask({
      task: new JsTask('./src/scripts/spa/main-sync.js', output),
      test: () => {
        runTask({
          task,
          test,
          done
        });
      }
    });
  });
});
