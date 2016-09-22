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
  // , sprites: {
  //   image: ['img-icon'], // iconPath = app/images/img-icon
  //   svg: ['svg-icon']    //  svgPath = app/images/svg-icon
  // },
  // cache: true,
  // assets: {
  //   root: '/path/to/your_project', // default: `assets`
  //   publicPath: 'public',
  //   subDir: ''
  // }
};

balm.go(function(mix) {
  if (balm.config.production) {
    // publish assets(styles,javascripts,images,fonts) to `/path/to/your_project/public`
    mix.publish();

    // publish `index.html` to `/path/to/your_project/public`
    mix.publish('index.html', 'public', {
      basename: 'yourFilename',
      suffix: '.blade',
      extname: '.php'
    });
  }
});
