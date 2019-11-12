const jsConfig = require('./_test');
const balm = require('../balm');
let balmrc = require('../balmrc'); // Note: Imported Variables Are Read-only

const scripts = Object.assign(jsConfig, {
  options: {
    compress: {
      drop_console: false
    }
  }
});

const balmConfig = Object.assign(balmrc, {
  roots: {
    source: 'spa'
  },
  html: {
    options: {
      collapseWhitespace: false
    }
  },
  scripts,
  extras: {
    excludes: ['empty.txt']
  },
  assets: {
    publicUrl: '/',
    subDir: 'web',
    // virtualDir: 'awesome',
    cache: true,
    excludes: [
      'dist/3c/icons/*',
      'dist/web/3c/icons/*',
      'dist/awesome/web/3c/icons/*'
    ]
  }
});

balm.config = balmConfig;

balm.go(mix => {
  // mix.publish();
  // mix.publish('cdn-local.html', 'public');
});
