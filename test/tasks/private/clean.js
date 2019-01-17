import CleanTask from '../../../lib/tasks/private/clean';

describe('Clean Task', () => {
  it('cleanTask', done => {
    const task = new CleanTask();
    const test = `dist`;

    runTask(
      {
        task,
        test,
        done
      },
      false
    );
  });
});
