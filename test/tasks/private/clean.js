import CleanTask from '../../../lib/tasks/private/clean';

describe('Clean Task', () => {
  it('cleanTask', done => {
    const cleanTask = new CleanTask();
    const task = gulp.series(cleanTask.fn);
    const test = () => {
      fs.existsSync(`${balm.config.workspace}/dist`).should.be.false;
    };

    runTask(task, test, done);
  });
});
