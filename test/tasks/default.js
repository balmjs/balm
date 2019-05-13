describe('Default Task', () => {
  it('run balm task', done => {
    if (balm.config.isProd) {
      balm.go(mix => {
        let input = 'index.template.html';
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
          'dist/main-sync.html',
          'dist/manifest.json'
          // 'dist/web/a/main.41255e24.css',
          // 'dist/web/b/main.d2c55522.js',
          // 'dist/web/c/logo.bae9298c.svg',
          // 'dist/web/d/roboto-regular.f94d5e51.woff'
        ]
      : [
          '.tmp/main-sync.html',
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
