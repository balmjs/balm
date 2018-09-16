describe('Copy Task', () => {
  beforeEach(() => balm.reset());

  it('copies a file to a new location', done => {
    let from = './src/copy/foo/foo.txt';
    let to = 'copy-dest';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist(`${to}/foo.txt`);

      done();
    });
  });

  it('copies and renames a file to a new location', done => {
    let from = './src/copy/foo/foo.txt';
    let to = 'copy-dest';
    let options = {
      basename: 'changed'
    };

    balm.go(mix => mix.copy(from, to, options));

    runGulp(() => {
      shouldExist(`${to}/changed.txt`);

      done();
    });
  });

  it('copies an array of folder paths to a new location', done => {
    let from = ['./src/copy/foo/*', './src/copy/bar/*'];
    let to = 'copy-dest/foobar';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist(`${to}/foo.txt`);
      shouldExist(`${to}/bar.txt`);

      done();
    });
  });

  it('copies a folder with a period in its name to a new location', done => {
    let from = './src/copy/foo.bar/*';
    let to = 'copy-dest/some.dir';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist(`${to}/baz.txt`);

      done();
    });
  });
});
