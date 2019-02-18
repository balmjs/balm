const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const workspace = path.join(root, 'test-workspace');
const assets = path.join(workspace, 'assets');

const testConfig = {
  root,
  workspace,
  assets
};

const balmConfig = {
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
    autoprefixer: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead']
  },
  sprites: {
    image: ['img-icon']
  },
  assets: {
    publicUrl: '/',
    root: testConfig.assets,
    mainDir: 'public',
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
