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

    // Test build
    balm.go(mix => {
      // Test compiling
      mix.css('app/styles/main.css', '.tmp/styles/css');
      mix.sass('app/styles/main.sass', '.tmp/styles/sass');
      mix.sass('app/styles/main.scss', '.tmp/styles/scss');
      mix.less('app/styles/main.less', '.tmp/styles/less');
      mix.js('./app/scripts/main-sync.js', '.tmp/scripts');
      // Test minify
      mix.cssmin(['.tmp/styles/**/*.css'], 'dist/minify/css');
      mix.jsmin(['.tmp/scripts/**/*.js'], 'dist/minify/js');
      // Test version
      // mix.copy(balm.config.workspace + '/app/index.html', balm.config.workspace + '/dist/minify');
      // mix.copy(balm.config.workspace + '/dist/minify/css/css/*.css', balm.config.workspace + '/dist/minify/css');
      // mix.version([
      //   'dist/minify/css/*.css',
      //   'dist/minify/js/*.js',
      //   'dist/minify/*.html'
      // ], 'dist/version');
      // Test copy
      mix.copy(`${balm.config.workspace}/app/index.html`, `${balm.config.workspace}/.tmp`, {
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
      // Test end
      mix.end(() => {
        console.log('gg');
        done();
      });
    });

    balm.go(); // Wrong

    balm.go('unkonwn'); // Wrong

    balm.go('default'); // Right
  });

  configTests(balm);
  fileTests();
});
