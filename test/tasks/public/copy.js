import CopyTask from '../../../lib/tasks/public/copy';

describe('Copy Task', () => {
  it('copies a file to a new location', done => {
    let input = './src/copy/foo/foo.txt';
    let output = 'copy-dest';

    const copyTask = new CopyTask(input, output);
    const task = gulp.series(copyTask.fn);
    const test = () => {
      shouldExist(`${output}/foo.txt`);
    };

    runTask(task, test, done);
  });

  it('copies and renames a file to a new location', done => {
    let input = './src/copy/foo/foo.txt';
    let output = 'copy-dest';
    let options = {
      basename: 'changed'
    };

    const copyTask = new CopyTask(input, output, options);
    const task = gulp.series(copyTask.fn);
    const test = () => {
      shouldExist(`${output}/changed.txt`);
    };

    runTask(task, test, done);
  });

  it('copies an array of folder paths to a new location', done => {
    let input = ['./src/copy/foo/*', './src/copy/bar/*'];
    let output = 'copy-dest/foobar';

    const copyTask = new CopyTask(input, output);
    const task = gulp.series(copyTask.fn);
    const test = () => {
      shouldExist(`${output}/foo.txt`);
      shouldExist(`${output}/bar.txt`);
    };

    runTask(task, test, done);
  });

  it('copies a folder with a period in its name to a new location', done => {
    let input = './src/copy/foo.bar/*';
    let output = 'copy-dest/some.dir';

    const copyTask = new CopyTask(input, output);
    const task = gulp.series(copyTask.fn);
    const test = () => {
      shouldExist(`${output}/baz.txt`);
    };

    runTask(task, test, done);
  });
});
