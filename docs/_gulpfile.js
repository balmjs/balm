// balm config simple demo

// 1. import balm
var balm = require('balm');

// 2. config balm
balm.config = {
  // server: {
  //   open: true,
  //   proxyTable: {
  //     '/api': {
  //       target: 'http://your.project.dev', // target host
  //       changeOrigin: true // needed for virtual hosted sites
  //     }
  //   }
  // },
  roots: {
    source: 'app' // source code root
  },
  paths: {
    source: {
      css: 'styles',   // css dir = ./app/styles
      js: 'scripts',    // js dir = ./app/scripts
      img: 'images', // image dir = ./app/images
      font: 'fonts'   // font dir = ./app/fonts
    }
  },
  styles: {
    ext: 'scss', // style extensions
    autoprefixer: ['last 2 versions']
  },
  scripts: {
    entry: {
      common: ['your-project-vendors', 'your-project-plugins'],
      main: './app/scripts/main'
    },
    vendors: ['common'] // <script src="js/vendor/common.js"></script>
  }
  // , sprites: {
  //   image: ['img-icon'], // iconPath = ./app/images/img-icon
  //   svg: ['svg-icon']    //  svgPath = ./app/images/svg-icon
  // },
  // cache: true,
  // assets: {
  //   root: '/path/to/your_project', // remote project root path
  //   publicPath: 'public',
  //   subDir: ''
  // }
};

// 3. run balm
balm.go(function(mix) {
  if (balm.config.production) {
    // publish assets(styles,scripts,images,fonts) to `/path/to/your_project/public`
    mix.publish();

    // publish `index.html` to `/path/to/your_project/views`
    mix.publish('index.html', 'views', {
      basename: 'yourFilename',
      suffix: '.blade',
      extname: '.php'
    });
  }
});
