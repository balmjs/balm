describe('Less Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Less files to the .tmp/dist directory', done => {
    let src = './src/styles/main.less';

    balm.go(mix => {
      mix.less(src);
    });

    runGulp(() => {
      if (balm.config.production) {
        shouldExist('dist/web/a/main.css');
      } else {
        shouldExist('.tmp/a/main.css');
      }

      done();
    });
  });

  it('compiles Less files to a custom directory and file name', done => {
    let src = './src/styles/main.less';
    let output = '.compile/less';

    balm.go(mix => mix.less(src, output));

    runGulp(() => {
      shouldExist(`${output}/main.css`);

      done();
    });
  });
});
