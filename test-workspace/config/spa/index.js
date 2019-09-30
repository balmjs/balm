import jsConfig, { isCDN } from './_test';
import balm from '../balm';
let balmConfig = require('../balmrc'); // Note: Imported Variables Are Read-only

const scripts = Object.assign(jsConfig, {
  eslint: true,
  options: {
    compress: {
      drop_console: false
    }
  }
});

if (isCDN) {
  balmConfig.assets.publicUrl = '/';
  balmConfig.assets.mainDir = '/';
  balmConfig.assets.subDir = 'public/web';
} else {
  balmConfig.assets.subDir = 'web';
}

balmConfig = Object.assign(balmConfig, {
  roots: {
    source: 'spa'
  },
  scripts
  // useDefaults: false
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
  // mix.url('.output/**/*.css', '.output/url');
  // mix.sass('spa/styles/main.scss', '.output/sass');
  // mix.less('spa/styles/main.less', '.output/less');
  // mix.css('spa/styles/main.css', '.output/css');
  // mix.js('./spa/scripts/main-sync.js', '.output/js');
  // mix.copy(
  //   '../node_modules/workbox-sw/build/workbox-sw.js',
  //   balm.config.dest.base,
  //   {
  //     basename: 'abc',
  //     suffix: '.min'
  //   }
  // );
  // mix.version('.output/**/*.css', '.output/version');
  // mix.zip();

  // mix.html();
  // mix.css('spa/styles/main.css', '.tmp/css');
  // mix.js('./spa/scripts/main-sync.js', '.tmp/js');

  if (mix.env.isProd) {
    // mix.publish();
    // mix.publish('index.html', 'views', {
    //   basename: 'home',
    //   suffix: '.blade',
    //   extname: '.php'
    // });
    // mix.publish([
    //   {
    //     input: 'index.html',
    //     output: 'views/home',
    //     options: {
    //       basename: 'index',
    //       suffix: '.blade',
    //       extname: '.php'
    //     }
    //   },
    //   {
    //     input: 'main-sync.html',
    //     output: 'views/hello',
    //     options: {
    //       basename: 'main',
    //       suffix: '.blade',
    //       extname: '.php'
    //     }
    //   }
    // ]);
    // mix.js([`./src/scripts/spa/main-hello.js`], 'dist', {
    //   output: {
    //     library: 'MyLibrary',
    //     libraryTarget: 'umd'
    //   }
    // });
  } else {
    // mix.serve((watcher, reload) => {
    //   watcher.on('add', file => {
    //     console.log('add', file);
    //   });
    //   watcher.on('unlink', file => {
    //     console.log('unlink', file);
    //   });
    //   watcher.on('change', file => {
    //     console.log('change', file);
    //     let exname = file.split('.')[1];
    //     if (exname === 'css') {
    //       mix.css('spa/styles/main.css', '.tmp/css');
    //     }
    //     if (exname === 'js') {
    //       mix.js('./spa/scripts/main-sync.js', '.tmp/js');
    //       reload();
    //     }
    //   });
    // });
    // PWA API test
    // mix.generateSW();
    // mix.injectManifest();
  }

  // FTP test
  // mix.ftp('dist/**/*');
});
