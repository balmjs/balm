import ZipTask from '../../../lib/tasks/public/zip';

describe('Zip Task', () => {
  // NOTE: just for `dist`
  // it('generate zip file', done => {
  //   const task = new ZipTask();
  //   const test = 'archive.zip';

  //   runTask({
  //     task,
  //     test,
  //     done
  //   });
  // });

  it('generate zip file to a custom output path', done => {
    let input = './src/**/*';
    let output = '.compile';

    const task = new ZipTask(input, output);
    const test = `${output}/archive.zip`;

    runTask({
      task,
      test,
      done
    });
  });
});
