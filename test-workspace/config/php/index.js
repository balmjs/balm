const path = require('path');
const balmrc = require('../balmrc');

console.info('balm@php');

module.exports = Object.assign(balmrc, {
  inFrontend: false, // for PHP framework
  server: {
    proxy: 'balmjs.local',
    watchFiles: ['php/resources/views/**/*.php']
  },
  roots: {
    source: 'php/resources',
    target: 'php/public'
  },
  paths: {
    source: {
      base: 'assets',
      css: 'assets/sass',
      js: 'assets/js',
      img: 'assets/images',
      font: 'assets/fonts',
      media: 'assets/media'
    }
  },
  styles: {
    extname: 'scss'
  },
  scripts: {
    entry: {
      app: './php/resources/assets/js/app.js'
    }
  },
  assets: {
    publicUrl: '/',
    root: path.resolve(__dirname, '..', '..', 'php'),
    mainDir: 'public',
    subDir: 'web',
    cache: true
  }
});
