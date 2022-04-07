const env = require('./env');

const balmBaseConfig = {
  workspace: env.workspace,
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
    cache: true,
    excludes: ['dist/3c/icons/*']
  },
  logs: {
    level: 2
  }
};

module.exports = balmBaseConfig;
