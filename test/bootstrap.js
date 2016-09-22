import balm from '../lib/main';
import balmConfig from './balm.config';

before(function() {
  console.log('Previously on BalmJS:\n', balm.config); // test get

  balm.config = balmConfig; // test set

  // test build
  balm.go(function(mix) {
    // test compiling
    mix.css('app/styles/main.css', '.tmp/styles/css');
    mix.sass('app/styles/main.sass', '.tmp/styles/sass');
    mix.sass('app/styles/main.scss', '.tmp/styles/scss');
    mix.less('app/styles/main.less', '.tmp/styles/less');
    mix.js('./app/scripts/main.js', '.tmp/scripts');
    // test minify
    mix.cssmin(['.tmp/styles/**/*.css'], 'dist/minify/css');
    mix.jsmin(['.tmp/scripts/**/*.js'], 'dist/minify/js');
    // test copy
    mix.copy(balm.config.workspace + '/app/index.html', balm.config.assets.static + '/copy-dest', {
      basename: 'newfile',
      suffix: '.blade',
      extname: '.php'
    });
    // // test zip
    mix.remove(balm.config.workspace + '/archive.zip');
    mix.zip();
    // // test publish
    mix.publish();
    mix.publish('index.html', 'public/web', {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    });
  });

  balm.go(); // wrong

  balm.go('unkonwn'); // wrong

  balm.go('default'); // right
});
