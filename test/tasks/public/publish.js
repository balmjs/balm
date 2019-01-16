import PublishTask from '../../../lib/tasks/public/publish';

// NOTE: just for `dist`
describe('Publish Task', () => {
  it('publish assets to remote', done => {
    const publishTask = new PublishTask();
    const task = gulp.series(publishTask.fn);
    const test = () => {
      shouldExist('assets/public/web');
    };

    runTask(task, test, done);
  });

  it('publish templates to remote', done => {
    let input = 'index.html';
    let output = 'views';
    let options = {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    };

    const publishTask = new PublishTask(input, output, options);
    const task = gulp.series(publishTask.fn);
    const test = () => {
      shouldExist('assets/views/home.blade.php');
    };

    runTask(task, test, done);
  });
});
