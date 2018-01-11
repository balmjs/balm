import gulp from 'gulp';
import balm from '../lib/main';
import balmConfig from './config/balmrc';
// import './config/task';

balm.config = balmConfig;

// Function test
// balm.beforeTask = () => {
//   console.log('Hello BalmJS');
// };
// balm.afterTask = () => {
//   console.log('gg');
// };

// String test
// balm.beforeTask = 'task:before';
// balm.afterTask = 'task:after';

// Test build
balm.go(mix => {
  if (balm.config.production) {
    // Test compiling
    mix.css('src/styles/main.css', '.compile/styles/css');
    mix.sass('src/styles/main.scss', '.compile/styles/scss');
    mix.less('src/styles/main.less', '.compile/styles/less');
    mix.js('./src/scripts/main-sync.js', '.compile/scripts');
    // Test minify
    mix.cssmin(['.tmp/css/**/*.css'], '.compile/minify/css');
    mix.jsmin(['.tmp/js/**/*.js'], '.compile/minify/js');
    // Test version
    // mix.copy('src/index.html', '.compile/minify');
    // mix.copy('dist/minify/css/css/*.css', '.compile/minify/css');
    // mix.version([
    //   '.compile/minify/css/*.css',
    //   '.compile/minify/js/*.js',
    //   '.compile/minify/*.html'
    // ], '.compile/version');
    // Test copy
    mix.copy(`src/index.html`, `.compile`, {
      basename: 'newfile',
      extname: '.php'
    });
    // Test zip
    mix.remove(`archive.zip`);
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
