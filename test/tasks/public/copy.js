import CopyTask from '../../../lib/tasks/public/copy';

describe('Copy Task', () => {
  // it('copies a file to a new location', () => {
  //   const copyTask = new CopyTask();
  //   let input = './src/copy/foo/foo.txt';
  //   let output = 'copy-dest';
  //   copyTask.input = input;
  //   copyTask.output = output;
  //   const task = gulp.series(copyTask.fn);
  //   const done = () => {
  //     shouldExist(`${output}/foo.txt`);
  //   };
  //   runTask(task, done);
  // });
  // it('copies and renames a file to a new location', () => {
  //   const copyTask = new CopyTask();
  //   let input = './src/copy/foo/foo.txt';
  //   let output = 'copy-dest';
  //   let options = {
  //     basename: 'changed'
  //   };
  //   copyTask.input = input;
  //   copyTask.output = output;
  //   copyTask.renameOptions = options;
  //   const task = gulp.series(copyTask.fn);
  //   const done = () => {
  //     shouldExist(`${output}/changed.txt`);
  //   };
  //   runTask(task, done);
  // });
  // it('copies an array of folder paths to a new location', () => {
  //   const copyTask = new CopyTask();
  //   let input = ['./src/copy/foo/*', './src/copy/bar/*'];
  //   let output = 'copy-dest/foobar';
  //   copyTask.input = input;
  //   copyTask.output = output;
  //   const task = gulp.series(copyTask.fn);
  //   const done = () => {
  //     shouldExist(`${output}/foo.txt`);
  //     shouldExist(`${output}/bar.txt`);
  //   };
  //   runTask(task, done);
  // });
  // it('copies a folder with a period in its name to a new location', () => {
  //   const copyTask = new CopyTask();
  //   let input = './src/copy/foo.bar/*';
  //   let output = 'copy-dest/some.dir';
  //   copyTask.input = input;
  //   copyTask.output = output;
  //   const task = gulp.series(copyTask.fn);
  //   const done = () => {
  //     shouldExist(`${output}/baz.txt`);
  //   };
  //   runTask(task, done);
  // });
});
