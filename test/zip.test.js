describe('Zip Task', () => {

  beforeEach(() => balm.reset());

  it('generate zip file', done => {
    balm.go(mix => {
      mix.zip();
    });

    runGulp(() => {
      shouldExist('archive.zip');

      done();
    });
  });

  it('generate zip file to a custom output path', done => {
    let src = './src/**/*';
    let output = '.compile'

    balm.go(mix => {
      mix.zip(src, output);
    });

    runGulp(() => {
      shouldExist('.compile/archive.zip');

      done();
    });
  });
});
