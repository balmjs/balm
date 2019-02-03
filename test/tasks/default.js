describe('Default Task', () => {
  it('run balm task', done => {
    if (balm.config.isProd) {
      balm.go(mix => {
        let input = 'index.html';
        let output = 'views';
        let options = {
          basename: 'home',
          suffix: '.blade',
          extname: '.php'
        };
        mix.publish();
        mix.publish(input, output, options);

        done();
      });
    } else {
      balm.go(() => {
        done();
      });
    }
  });

  it('verify balm task result', done => {
    const task = 'default';
    const test = balm.config.isProd
      ? [
          'dist/index.html',
          'dist/manifest.json'
          // 'dist/web/a/main.41255e24.css',
          // 'dist/web/b/main.ccf18c07.js',
          // 'dist/web/c/logo.bae9298c.svg',
          // 'dist/web/d/roboto-regular.f94d5e51.woff'
        ]
      : [
          '.tmp/index.html',
          '.tmp/a/main.css',
          '.tmp/a/main.css.map',
          '.tmp/b/main.js',
          '.tmp/c/img-icon-sprite.png',
          '.tmp/fonts/roboto-regular.woff'
        ];

    runTask({
      task,
      test,
      done
    });
  });
});
