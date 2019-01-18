describe('Default Task', () => {
  it('run balm task', done => {
    balm.go(mix => {
      if (balm.config.production) {
        let input = 'index.html';
        let output = 'views';
        let options = {
          basename: 'home',
          suffix: '.blade',
          extname: '.php'
        };

        mix.publish();
        mix.publish(input, output, options);
      }

      console.log('gg');

      done();
    });
  });

  it('verify balm task result', done => {
    const task = 'default';
    const test = [
      'dist/index.html',
      'dist/manifest.json',
      'dist/web/a/main.d2551023.css',
      'dist/web/b/main-sync.d17a5582.js',
      'dist/web/c/logo.bae9298c.svg',
      'dist/web/d/roboto-regular.f94d5e51.woff'
    ];

    runTask({
      task,
      test,
      done
    });
  });
});
