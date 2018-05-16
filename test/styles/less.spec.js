describe('Less Task', () => {
  beforeEach(() => balm.reset());

  it('compiles Less files to the public/css directory', done => {
    let src = './src/styles/main.less';

    balm.go(mix => {
      mix.less(src);
    });

    runGulp(() => {
      shouldExist('dist/web/a/main.css');

      done();
    });
  });

  it('compiles Less files to a custom directory and file name', done => {
    let src = './src/styles/main.less';
    let output = '.compile/less';

    balm.go(mix => mix.less(src, output));

    runGulp(() => {
      shouldExist('.compile/less/main.css');

      done();
    });
  });
});
