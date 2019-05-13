import balm from '../../../dist'; // from local
// import balm from 'balm'; // from node_modules

import jsConfig from './test';
let balmConfig = require('../balmrc'); // Note: Imported Variables Are Read-only

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

// FTP test
// balm.config.useDefault = false;

// Test build
balm.go(mix => {
  mix.copy(
    'node_modules/workbox-sw/build/workbox-sw.js',
    balm.config.isProd ? balm.config.roots.target : balm.config.roots.tmp
  );

  if (balm.config.isProd) {
    mix.publish();
    mix.publish('index.template.html', 'views', {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    });
  }

  // PWA test
  // mix.generateSW();
  // mix.injectManifest();

  // FTP test
  // mix.ftp('dist/**/*');
});
