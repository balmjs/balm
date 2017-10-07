describe('Scripts Task', () => {
  beforeEach(() => balm.reset());

  it('bundles with Webpack', done => {
    let src = './src/scripts/main-sync.js';

    balm.go(mix => mix.js(src));

    runGulp(() => {
      shouldExist('dist/js/main.js');

      done();
    });
  });

  it('bundles with Webpack to a custom output path', done => {
    let src = './src/scripts/main-sync.js';
    let output = '.compile/js';

    balm.go(mix => mix.js(src, output));

    runGulp(() => {
      shouldExist('.compile/js/main.js');

      done();
    });
  });
});
