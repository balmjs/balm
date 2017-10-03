/* eslint no-console: 0 */
import balm from '../lib/main';
import balmConfig from '../test-workspace/balmrc';
import configTests from './config.test';
import fileTests from './file.test';

describe('Balm Test', () => {
  // Test get
  // console.log('Previously on BalmJS:\n', balm.config, '\n');

  before(done => {
    balm.config = balmConfig;
    balm.config.debug = true;
    balm.config.afterTask = () => {
      console.log('gg');
      done();
    };

    // Test build
    balm.go(mix => {
      // Test compiling
      mix.css('src/styles/main.css', '.compile/styles/css');
      mix.sass('src/styles/main.sass', '.compile/styles/sass');
      mix.sass('src/styles/main.scss', '.compile/styles/scss');
      mix.less('src/styles/main.less', '.compile/styles/less');
      mix.js('./src/scripts/main-sync.js', '.compile/scripts');
      // Test minify
      mix.cssmin(['.tmp/styles/**/*.css'], '.compile/minify/css');
      mix.jsmin(['.tmp/scripts/**/*.js'], '.compile/minify/js');
      // Test version
      // mix.copy(balm.config.workspace + '/src/index.html', balm.config.workspace + '/dist/minify');
      // mix.copy(balm.config.workspace + '/dist/minify/css/css/*.css', balm.config.workspace + '/dist/minify/css');
      // mix.version([
      //   'dist/minify/css/*.css',
      //   'dist/minify/js/*.js',
      //   'dist/minify/*.html'
      // ], 'dist/version');
      // Test copy
      mix.copy(`${balm.config.workspace}/src/index.html`, `${balm.config.workspace}/.tmp`, {
        basename: 'newfile',
        extname: '.php'
      });
      // Test zip
      mix.remove(`${balm.config.workspace}/archive.zip`);
      mix.zip();
      // Test publish
      mix.publish();
      mix.publish('index.html', 'views', {
        basename: 'home',
        suffix: '.blade',
        extname: '.php'
      });
    });

    balm.go(); // Wrong

    balm.go('unkonwn'); // Wrong

    balm.go('default'); // Right
  });

  configTests(balm);
  fileTests();
});
