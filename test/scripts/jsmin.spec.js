describe('JsMin Task', () => {
  beforeEach(() => balm.reset());

  it('minify Js files to a custom directory and file name', done => {
    let src = './src/scripts/main-sync.js';
    let output = '.compile/minify';
    let compiledSrc = '.compile/minify/main.js';

    balm.go(mix => {
      mix.js(src, output);
      mix.jsmin(compiledSrc, output);
    });

    runGulp(() => {
      shouldExist('.compile/minify/main.min.js');

      done();
    });
  });
});
