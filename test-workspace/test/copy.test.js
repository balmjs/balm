describe('Copy Task', () => {

  beforeEach(() => balm.reset());

  it('copies a file to a new location', done => {
    let from = './src/copy/foo/foo.txt';
    let to = 'copy-dest';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist('copy-dest/foo.txt');

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
      shouldExist('copy-dest/changed.txt');

      done();
    });
  });

  it('copies an array of folder paths to a new location', done => {
    let from = ['./src/copy/foo/*', './src/copy/bar/*'];
    let to = 'copy-dest/foobar';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist('copy-dest/foobar/foo.txt');
      shouldExist('copy-dest/foobar/bar.txt');

      done();
    });
  });

  it('copies a folder with a period in its name to a new location', done => {
    let from = './src/copy/foo.bar/*';
    let to = 'copy-dest/some.dir';

    balm.go(mix => mix.copy(from, to));

    runGulp(() => {
      shouldExist('copy-dest/some.dir/baz.txt');

      done();
    });
  });
});
