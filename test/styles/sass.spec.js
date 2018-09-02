describe('Sass Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Sass files to the .tmp/dist directory', done => {
    let src = './src/styles/main.scss';

    balm.go(mix => {
      mix.sass(src);
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

  it('compiles Sass files to a custom directory and file name', done => {
    let src = './src/styles/main.scss';
    let output = '.compile/sass';

    balm.go(mix => mix.sass(src, output));

    runGulp(() => {
      if (balm.config.production) {
        shouldExist('.compile/sass/main.min.css');
      } else {
        shouldExist('.compile/sass/main.css');
      }

      done();
    });
  });
});
