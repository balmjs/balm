describe('Version Task', () => {
  beforeEach(() => balm.reset());

  it('cache css files', done => {
    let src = './src/styles/main.css';
    let output = '.compile/cache';

    balm.go(mix => {
      mix.copy(src, output);
      mix.version('.compile/cache/main.css', output);
    });

    runGulp(() => {
      shouldExist('.compile/cache/main.d0093e89.css');

      done();
    });
  });

  it('cache js files', done => {
    let src = './src/scripts/main-sync.js';
    let output = '.compile/cache';

    balm.go(mix => {
      mix.js(src, output);
      mix.version('.compile/cache/main.js', output);
    });

    runGulp(() => {
      shouldExist('.compile/cache/main.42f4914e.js');

      done();
    });
  });
});
