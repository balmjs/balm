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
      img: 'images',
      font: 'fonts'
    }
  },
  styles: {
    ext: 'scss'
  },
  scripts: {
    entry: {
      common: ['jquery'],
      main: './app/scripts/main.js'
    },
    vendors: ['common']
  }
  // sprites: {
  //   image: ['img-icon'],
  //   svg: ['svg-icon']
  // },
  // cache: true,
  // assets: {
  //   root: 'assets',
  //   publicPath: 'public',
  //   subDir: ''
  // }
};

balm.go(function (mix) {
  if (balm.config.production) {
    // mix.remove('./assets');

    mix.publish(); // publish assets to `./assets/public`

    mix.publish('index.html', 'public');
    // mix.publish('index.html', 'public', {
    //   basename: 'yourFilename',
    //   suffix: '.blade',
    //   extname: '.php'
    // });
  }
});
