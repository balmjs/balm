var path = require('path');

var root = path.resolve(__dirname, '..', '..', '..');
var workspace = path.join(root, 'test-workspace');
var assets = path.join(workspace, 'assets');

var testConfig = {
  root: root,
  workspace: workspace,
  assets: assets
};

var balmConfig = {
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
  cache: false,
  assets: {
    publicUrl: '/',
    root: testConfig.assets,
    publicPath: 'public'
  }
};

module.exports = balmConfig;
