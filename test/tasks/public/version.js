import VersionTask from '../../../lib/tasks/public/version';
import CopyTask from '../../../lib/tasks/public/copy';
import JsTask from '../../../lib/tasks/public/js';

describe('Version Task', () => {
  it('cache css files', done => {
    let input = '.compile/cache/main.css';
    let output = '.compile/cache';

    const task = new VersionTask(input, output);
    const test = `${output}/main.d0093e89.css`;

    const copyTask = new CopyTask('./src/styles/main.css', output);
    gulp.series(copyTask.fn, () => {
      runTask({
        task,
        test,
        done
      });
    })();
  });

  it('cache js files', done => {
    let input = '.compile/cache/main.js';
    let output = '.compile/cache';

    const task = new VersionTask(input, output);
    const test = `${output}/main.e31b0757.js`;

    const jsTask = new JsTask('./src/scripts/main-sync.js', output);
    gulp.series(jsTask.fn, () => {
      runTask({
        task,
        test,
        done
      });
    })();
  });
});
