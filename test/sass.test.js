describe('Sass Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Sass files to the public/css directory', done => {
    let src = './src/styles/main.scss';

    balm.go(mix => {
      mix.sass(src);
    });

    runGulp(() => {
      shouldExist('dist/web/css/main.css');

      done();
    });
  });

  it('compiles Sass files to a custom directory and file name', done => {
    let src = './src/styles/main.scss';
    let output = '.compile/css';

    balm.go(mix => mix.sass(src, output));

    runGulp(() => {
      shouldExist('.compile/css/main.css');

      done();
    });
  });
});
