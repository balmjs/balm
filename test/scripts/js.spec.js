describe('Scripts Task', () => {
  beforeEach(() => balm.reset());

  it('bundles JS file to the .tmp/dist directory', done => {
    let src = './src/scripts/main-sync.js';

    balm.go(mix => mix.js(src));

    runGulp(() => {
      if (balm.config.production) {
        shouldExist('dist/web/b/main.js');
      } else {
        shouldExist('.tmp/b/main.js');
      }

      done();
    });
  });

  it('bundles JS file to a custom directory', done => {
    let src = './src/scripts/main-sync.js';
    let output = '.compile/js';

    balm.go(mix => mix.js(src, output));

    runGulp(() => {
      shouldExist(`${output}/main.js`);

      done();
    });
  });

  it('minify JS file to a custom directory', done => {
    let src = ['./src/scripts/cmd/*.js'];
    let output = '.compile/cmd';
    let uglifyOptions = {
      mangle: false
    };

    balm.go(mix => {
      mix.jsmin(src, output, uglifyOptions);
    });

    runGulp(() => {
      shouldExist(`${output}/main.min.js`);
      shouldExist(`${output}/spinning.min.js`);

      done();
    });
  });
});
