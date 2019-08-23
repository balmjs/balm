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
          'dist/rev-manifest.json'
          // 'dist/web/a/main.41255e24.css',
          // 'dist/web/b/main.5a7fb36d.js',
          // 'dist/web/c/logo.bae9298c.svg',
          // 'dist/web/d/roboto-regular.f94d5e51.woff'
        ]
      : [
          '.tmp/main-sync.html',
          '.tmp/a/main.css',
          '.tmp/b/main.js',
          '.tmp/c/img-icon-sprite.png',
          '.tmp/d/roboto-regular.woff' // NOTE: has bug?
        ];

    runTask({
      task,
      test,
      done
    });
  });
});
