describe('CssMin Task', () => {
  beforeEach(() => balm.reset());

  it('minify Css files to a custom directory and file name', done => {
    let src = './src/styles/main.css';
    let output = '.compile/minify';

    balm.go(mix => {
      mix.copy(src, output);
      mix.cssmin(src, output);
    });

    runGulp(() => {
      shouldExist('.compile/minify/main.min.css');

      done();
    });
  });
});
