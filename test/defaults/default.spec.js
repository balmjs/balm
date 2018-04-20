import configTests from './config.spec';

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
      // shouldExist('dist/web/css/main.2280f1dc.css');
      // shouldExist('dist/web/js/main.835e9446.js');
      // shouldExist('dist/web/img/logo.bae9298c.svg');
      // shouldExist('dist/web/font/roboto-regular.77cf2123.woff');

      done();
    });
  });
});
