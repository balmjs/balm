var path = require('path');

var root = path.resolve(__dirname, '..', '..');
var workspace = path.join(root, 'test-workspace');
var assets = path.join(workspace, 'assets');

var testConfig = {
  root: root,
  workspace: workspace,
  assets: assets
};

var balmConfig = {
  // debug: true,
  server: {
    open: false
  },
  workspace: testConfig.workspace,
  roots: {
    source: 'src',
    target: 'dist'
  },
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts',
      media: 'media'
    },
    target: {
      css: 'a',
      js: 'b',
      img: 'c',
      font: 'd',
      media: 'e'
    }
  },
  styles: {
    ext: 'css',
    autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
  },
  sprites: {
    image: ['img-icon'],
    svg: ['svg-icon']
  },
  assets: {
    publicUrl: '/',
    root: testConfig.assets,
    publicPath: 'public',
    // NOTE: Extra cache files
    // includes: [
    //   'dist/web/css/vendor.css',
    //   'dist/web/js/vendors/jquery.js',
    //   'dist/web/js/vendors/lodash.js'
    // ],
    excludes: ['dist/web/img/icons/icon-*.png']
  }
};

module.exports = balmConfig;
