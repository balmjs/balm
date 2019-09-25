const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');
const remoteRoot = path.join(workspace, 'assets');

const balmConfig = {
  logs: {
    level: 1
  },
  workspace,
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts',
      media: 'media'
    }
    // target: {
    //   css: 'a',
    //   js: 'b',
    //   img: 'c',
    //   font: 'd',
    //   media: 'e'
    // }
  },
  styles: {
    extname: 'css',
    sprites: ['img-icon']
  },
  extras: {
    excludes: ['empty.txt', 'service-worker.js']
  },
  assets: {
    publicUrl: '/',
    root: remoteRoot,
    mainDir: 'public',
    // NOTE: Extra cache files
    // includes: [
    //   'dist/web/css/vendor.css',
    //   'dist/web/js/vendors/jquery.js',
    //   'dist/web/js/vendors/lodash.js'
    // ],
    excludes: ['dist/web/img/icons/icon-*.png', 'dist/web/c/icons/icon-*.png']
  }
};

module.exports = balmConfig;
