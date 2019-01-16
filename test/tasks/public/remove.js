import RemoveTask from '../../../lib/tasks/public/remove';

describe('Remove Task', () => {
  it('remove a file', done => {
    let input = './src/remove/remove-file.txt';

    const removeTask = new RemoveTask(input);
    const task = gulp.series(removeTask.fn);
    const test = () => {
      fs.existsSync(`${workspace}/src/remove/remove-file.txt`).should.be.false;
    };

    runTask(task, test, done);
  });

  it('remove files', done => {
    let input = [
      './src/remove/remove-folder/a.txt',
      './src/remove/remove-folder/b.txt'
    ];

    const removeTask = new RemoveTask(input);
    const task = gulp.series(removeTask.fn);
    const test = () => {
      fs.existsSync(`${workspace}/src/remove/remove-folder/a.txt`).should.be
        .false;
      fs.existsSync(`${workspace}/src/remove/remove-folder/b.txt`).should.be
        .false;
    };

    runTask(task, test, done);
  });

  it('remove a folder', done => {
    let input = './src/remove/remove-folder';

    const removeTask = new RemoveTask(input);
    const task = gulp.series(removeTask.fn);
    const test = () => {
      fs.existsSync(`${workspace}/src/remove/remove-folder`).should.be.false;
    };

    runTask(task, test, done);
  });
});
