import gulp from 'gulp';
import balm from '../lib/main';
import balmConfig from './balmrc';

balm.config = balmConfig;

// Test build
balm.go(mix => {
  if (balm.config.production) {
    // Test compiling
    mix.css('src/styles/main.css', '.compile/styles/css');
    mix.sass('src/styles/main.scss', '.compile/styles/scss');
    mix.less('src/styles/main.less', '.compile/styles/less');
    mix.js('./src/scripts/main-sync.js', '.compile/scripts');
    // Test minify
    mix.cssmin(['.tmp/styles/**/*.css'], '.compile/minify/css');
    mix.jsmin(['.tmp/scripts/**/*.js'], '.compile/minify/js');
    // Test version
    // mix.copy(balm.config.workspace + '/src/index.html', balm.config.workspace + '/.compile/minify');
    // mix.copy(balm.config.workspace + '/dist/minify/css/css/*.css', balm.config.workspace + '/.compile/minify/css');
    // mix.version([
    //   '.compile/minify/css/*.css',
    //   '.compile/minify/js/*.js',
    //   '.compile/minify/*.html'
    // ], '.compile/version');
    // Test copy
    mix.copy(`${balm.config.workspace}/src/index.html`, `${balm.config.workspace}/.compile`, {
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
  }
});
