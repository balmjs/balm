import ZipTask from '../../../lib/tasks/public/zip';

describe('Zip Task', () => {
  // NOTE: just for `dist`
  // it('generate zip file', done => {
  //   const zipTask = new ZipTask();
  //   const task = gulp.series(zipTask.fn);
  //   const test = () => {
  //     shouldExist('archive.zip');
  //   };

  //   runTask(task, test, done);
  // });

  it('generate zip file to a custom output path', done => {
    let input = './src/**/*';
    let output = '.compile';

    const zipTask = new ZipTask(input, output);
    const task = gulp.series(zipTask.fn);
    const test = () => {
      shouldExist(`${output}/archive.zip`);
    };

    runTask(task, test, done);
  });
});
