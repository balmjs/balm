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
      shouldExist('.compile/js/main.js');

      done();
    });
  });
});
