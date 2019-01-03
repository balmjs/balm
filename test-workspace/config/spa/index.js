let balm = require('../../../dist/main'); // from local
// let balm = require('balm'); // from node_modules

// require('../task');

let balmConfig = require('../balmrc');
let jsConfig = require('./main-sync');
// let jsConfig = require('./main-async');
// let jsConfig = require('./vendor-all');
// let jsConfig = require('./vendor-custom');
// let jsConfig = require('./cdn');
// let jsConfig = require('./extract-css');

let scripts = Object.assign(jsConfig, {
  eslint: true,
  options: {
    compress: {
      drop_console: false
    }
  }
});

balmConfig.assets.subDir = 'web';
balmConfig = Object.assign(balmConfig, {
  scripts,
  cache: true
});

balm.config = balmConfig;

// Function test
// balm.beforeTask = () => {
//   console.log('Hello BalmJS');
// };
// balm.afterTask = () => {
//   console.log('gg');
// };

// String test
// balm.beforeTask = 'beforeTask';
// balm.afterTask = 'afterTask';

// Test build
balm.go(function(mix) {
  // if (balm.config.production) {
  //   // Test compiling
  //   mix.css('src/styles/main.css', '.compile/styles/css');
  //   mix.sass('src/styles/main.scss', '.compile/styles/scss');
  //   mix.less('src/styles/main.less', '.compile/styles/less');
  //   mix.js('./src/scripts/main-sync.js', '.compile/scripts');
  //   // Test version
  //   // mix.copy('src/index.html', '.compile/minify');
  //   // mix.copy('dist/minify/css/css/*.css', '.compile/minify/css');
  //   // mix.version([
  //   //   '.compile/minify/css/*.css',
  //   //   '.compile/minify/js/*.js',
  //   //   '.compile/minify/*.html'
  //   // ], '.compile/version');
  //   // Test copy
  //   mix.copy('src/index.html', '.compile', {
  //     basename: 'newfile',
  //     extname: '.php'
  //   });
  //   // Test zip
  //   mix.remove('archive.zip');
  //   mix.zip();
  //   // Test publish
  //   mix.publish();
  //   mix.publish('index.html', 'views', {
  //     basename: 'home',
  //     suffix: '.blade',
  //     extname: '.php'
  //   });
  // }
});
