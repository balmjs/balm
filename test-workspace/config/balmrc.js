const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

const balmConfig = {
  workspace,
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts',
      media: 'media'
    },
    target: {
      css: '1a',
      js: '2b',
      img: '3c',
      font: '4d',
      media: '5e'
    }
  },
  assets: {
    cache: true
  },
  logs: {
    level: 3
  }
};

module.exports = balmConfig;
