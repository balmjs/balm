describe('Publish Task', () => {

  beforeEach(() => {
    balm.reset();
    balm.config.useDefault = true;
  });

  it('publish assets to remote', done => {
    balm.go(mix => {
      mix.publish();
    });

    runGulp(() => {
      shouldExist('assets/public/web');

      done();
    });
  });

  it('publish templates to remote', done => {
    balm.go(mix => {
      mix.publish('index.html', 'views', {
        basename: 'home',
        suffix: '.blade',
        extname: '.php'
      });
    });

    runGulp(() => {
      shouldExist('assets/views/home.blade.php');

      done();
    });
  });
});
