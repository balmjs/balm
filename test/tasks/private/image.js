import ImageTask from '../../../lib/tasks/private/image';

describe('Image Task', () => {
  it('generate images', done => {
    const task = new ImageTask();
    const test = ['dist/web/c/logo.png', 'dist/web/c/logo.svg'];

    runTask({
      task,
      test,
      done
    });
  });
});
