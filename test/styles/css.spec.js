describe('Css Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Css files to the public/css directory', done => {
    let src = './src/styles/main.css';

    balm.go(mix => {
      mix.css(src);
    });

    runGulp(() => {
      shouldExist('dist/web/css/main.css');

      done();
    });
  });

  it('compiles Css files to a custom directory and file name', done => {
    let src = './src/styles/main.css';
    let output = '.compile/css';

    balm.go(mix => mix.css(src, output));

    runGulp(() => {
      shouldExist('.compile/css/main.css');

      done();
    });
  });
});
