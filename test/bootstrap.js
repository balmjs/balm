import balm from '../lib/main';
import balmConfig from './balm.config';

before(function() {
  console.log('Previously on BalmJS:\n', balm.config); // test get

  balm.config = balmConfig; // test set

  // test build
  balm.go(function(mix) {
    // test compiling
    mix.css('app/styles/main.css', balm.config.tmp.base + '/styles/css');
    mix.sass('app/styles/main.sass', balm.config.tmp.base + '/styles/sass');
    mix.sass('app/styles/main.scss', balm.config.tmp.base + '/styles/scss');
    mix.less('app/styles/main.less', balm.config.tmp.base + '/styles/less');
    mix.js('./app/scripts/main.js', balm.config.tmp.base + '/scripts');
    // test minify
    mix.cssmin('.tmp/styles/**/*.css', balm.config.target.static + '/minify/css');
    mix.jsmin('./.tmp/scripts/**/*.js', balm.config.target.static + '/minify/js');
    // test copy
    mix.copy(balm.config.workspace + '/app/index.html', balm.config.assets.static + '/copy-dest', {
      basename: 'newfile',
      suffix: '.blade',
      extname: '.php'
    });
    // test zip
    mix.remove(balm.config.workspace + '/archive.zip');
    mix.zip();
    // test publish
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
