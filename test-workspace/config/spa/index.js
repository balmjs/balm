const jsConfig = require('./_test');
let balmrc = require('../balmrc'); // Note: Imported Variables Are Read-only

const scripts = Object.assign(jsConfig, {
  options: {
    compress: {
      drop_console: false
    }
  }
});

module.exports = Object.assign(balmrc, {
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
