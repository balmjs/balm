const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');
const remoteRoot = path.join(workspace, 'assets');

const balmConfig = {
  workspace,
  roots: {
    source: 'spa'
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
    extname: 'css'
  },
  scripts: {
    entry: {
      main: './spa/scripts/main-sync.js'
    },
    options: {
      compress: {
        drop_console: false
      }
    }
  },
  assets: {
    root: remoteRoot
  }
};

export default balmConfig;
