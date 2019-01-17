import PublishTask from '../../../lib/tasks/public/publish';

// NOTE: just for `dist`
describe('Publish Task', () => {
  it('publish assets to remote', done => {
    const task = new PublishTask();
    const test = 'assets/public/web';

    runTask({
      task,
      test,
      done
    });
  });

  it('publish templates to remote', done => {
    let input = 'index.html';
    let output = 'views';
    let options = {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    };

    const task = new PublishTask(input, output, options);
    const test = 'assets/views/home.blade.php';

    runTask({
      task,
      test,
      done
    });
  });
});
