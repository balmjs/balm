import VersionTask from '../../../lib/tasks/public/version';
import CopyTask from '../../../lib/tasks/public/copy';

describe('Version Task', () => {
  it('cache css files', done => {
    let input = '.compile/cache/main.css';
    let output = '.compile/cache';

    const copyTask = new CopyTask('./src/styles/main.css', output);
    gulp.series(copyTask.fn)();

    const versionTask = new VersionTask(input, output);
    const task = gulp.series(versionTask.fn);
    const test = () => {
      shouldExist(`${output}/main.d0093e89.css`);
    };

    runTask(task, test, done);
  });

  it('cache js files', done => {
    let input = '.compile/cache/main.js';
    let output = '.compile/cache';

    const copyTask = new CopyTask('./src/scripts/main-sync.js', output);
    gulp.series(copyTask.fn)();

    const versionTask = new VersionTask(input, output);
    const task = gulp.series(versionTask.fn);
    const test = () => {
      shouldExist(`${output}/main.e31b0757.js`);
    };

    runTask(task, test, done);
  });
});
