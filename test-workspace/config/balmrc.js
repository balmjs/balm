var path = require('path');

// var jsConfig = require('./main-sync');
// var jsConfig = require('./main-async');
// var jsConfig = require('./vendor-all');
// var jsConfig = require('./vendor-custom');
// var jsConfig = require('./cdn');
// var jsConfig = require('./extract-css');
// var jsConfig = require('./ssr/client');
// var jsConfig = require('./ssr/server');
var jsConfig = require('./ssr');

var scripts = Object.assign(
  {},
  {
    eslint: true,
    options: {
      compress: {
        drop_console: false
      }
    }
  },
  jsConfig
);

var root = path.resolve(__dirname, '..', '..');
var workspace = path.join(root, 'test-workspace');
var assets = path.join(workspace, 'assets');

var testConfig = {
  root: root,
  workspace: workspace,
  assets: assets
};

var balmConfig = {
  // production: true,
  server: {
    open: false,
    historyOptions: true
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
      font: 'fonts'
    },
    target: {
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font'
    }
  },
  styles: {
    ext: 'css',
    autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
  },
  scripts,
  sprites: {
    image: ['img-icon'],
    svg: ['svg-icon']
  },
  cache: false,
  assets: {
    publicUrl: '/',
    root: testConfig.assets,
    publicPath: 'public',
    // subDir: 'web',
    // Extra cache files
    // includes: [
    //   'dist/web/css/vendor.css',
    //   'dist/web/js/vendors/jquery.js',
    //   'dist/web/js/vendors/lodash.js'
    // ],
    excludes: ['dist/web/img/icons/icon-*.png']
  }
};

module.exports = balmConfig;
