/* eslint no-console: 0 */
import balm from '../lib/main';
import balmConfig from './balm.config';

before(function() {
  // Test get
  // console.log('Previously on BalmJS:\n', balm.config, '\n');

  balm.config = balmConfig; // Test set

  // Test build
  balm.go(function(mix) {
    // Test compiling
    mix.css('app/styles/main.css', '.tmp/styles/css');
    mix.sass('app/styles/main.sass', '.tmp/styles/sass');
    mix.sass('app/styles/main.scss', '.tmp/styles/scss');
    mix.less('app/styles/main.less', '.tmp/styles/less');
    mix.js('./app/scripts/main.js', '.tmp/scripts');
    // Test minify
    mix.cssmin(['.tmp/styles/**/*.css'], 'dist/minify/css');
    mix.jsmin(['.tmp/scripts/**/*.js'], 'dist/minify/js');
    // Test copy
    mix.copy(balm.config.workspace + '/app/index.html', balm.config.assets.static + '/copy-dest', {
      basename: 'newfile',
      suffix: '.blade',
      extname: '.php'
    });
    // Test zip
    mix.remove(balm.config.workspace + '/archive.zip');
    mix.zip();
    // Test publish
    mix.publish();
    mix.publish('index.html', 'views', {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    });
    // Test end
    mix.end(function() {
      console.log('gg');
    });
  });

  balm.go(); // Wrong

  balm.go('unkonwn'); // Wrong

  balm.go('default'); // Right
});
