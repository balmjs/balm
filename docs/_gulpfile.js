// balm config demo

var balm = require('balm');

balm.config = {
  roots: {
    source: 'app'
  },
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images'
    }
  },
  styles: {
    ext: 'scss'
  },
  scripts: {
    entry: {
      common: ['jquery'],
      main: './src/scripts/main.js'
    },
    vendors: ['common']
  },
  sprites: {
    image: ['icon'],
    svg: ['icon']
  }
};

balm.go();
