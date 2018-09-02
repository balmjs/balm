describe('Css Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Css files to the .tmp/dist directory', done => {
    let src = './src/styles/main.css';

    balm.go(mix => {
      mix.css(src);
    });

    runGulp(() => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main.min.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }

      done();
    });
  });

  it('compiles Css files to a custom directory and file name', done => {
    let src = './src/styles/main.css';
    let output = '.compile/css';

    balm.go(mix => mix.css(src, output));

    runGulp(() => {
      if (balm.config.production) {
        shouldExist('.compile/css/main.min.css');
      } else {
        shouldExist('.compile/css/main.css');
      }

      done();
    });
  });
});
