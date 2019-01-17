import RemoveTask from '../../../lib/tasks/public/remove';

describe('Remove Task', () => {
  it('remove a file', done => {
    let input = './src/remove/remove-file.txt';

    const task = new RemoveTask(input);
    const test = `src/remove/remove-file.txt`;

    runTask(
      {
        task,
        test,
        done
      },
      false
    );
  });

  it('remove files', done => {
    let input = [
      './src/remove/remove-folder/a.txt',
      './src/remove/remove-folder/b.txt'
    ];

    const task = new RemoveTask(input);
    const test = [
      `src/remove/remove-folder/a.txt`,
      `src/remove/remove-folder/b.txt`
    ];

    runTask(
      {
        task,
        test,
        done
      },
      false
    );
  });

  it('remove a folder', done => {
    let input = './src/remove/remove-folder';

    const task = new RemoveTask(input);
    const test = `src/remove/remove-folder`;

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
