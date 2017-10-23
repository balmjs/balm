import configTests from './config.test';

describe('Default Task', () => {
  beforeEach(() => {
    balm.reset();
    balm.config.useDefault = true;
  });

  it('run default build task', done => {
    balm.go();

    runGulp(() => {
      configTests();

      shouldExist('dist/index.html');
      shouldExist('dist/manifest.json');
      // shouldExist('dist/web/css/main.fbcfc71a.css');
      // shouldExist('dist/web/js/main-sync.a16a5679.js');
      // shouldExist('dist/web/img/logo.005d8bd1.svg');
      // shouldExist('dist/web/font/roboto-regular.77cf2123.woff');

      done();
    });
  });
});
