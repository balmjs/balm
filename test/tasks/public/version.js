import VersionTask from '../../../lib/tasks/public/version';
import CopyTask from '../../../lib/tasks/public/copy';
import JsTask from '../../../lib/tasks/public/js';

describe('Version Task', () => {
  it('cache css files', done => {
    let input = '.compile/cache/main.css';
    let output = '.compile/cache';

    const task = new VersionTask(input, output);
    const test = `${output}/main.b3d80b2e.css`;

    runTask({
      task: new CopyTask('./spa/styles/main.css', output),
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
      ? `${output}/main.5a7fb36d.js`
      : `${output}/main.0d979d32.js`;

    runTask({
      task: new JsTask('./spa/scripts/main-sync.js', output),
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
