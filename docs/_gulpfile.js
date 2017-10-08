// Balm config simple demo

// 1. Import balm
var balm = require('balm');

// 2. Config balm
balm.config = {
  server: {
    open: true,
    proxyTable: {
      '/api': {
        target: 'http://your.project.dev', // Target host
        changeOrigin: true // Needed for virtual hosted sites
      }
    }
  },
  roots: {
    source: 'app' // Source code root
  },
  paths: {
    source: {
      css: 'styles', // CSS dir = ./app/styles
      js: 'scripts', // JS dir = ./app/scripts
      img: 'images', // Image dir = ./app/images
      font: 'fonts' // Font dir = ./app/fonts
    }
  },
  styles: {
    ext: 'scss', // Main style extension
    autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
  },
  scripts: {
    entry: {
      // HTML: <script src="js/vendor/mylib.js"></script>
      mylib: [
        'your-project-vendors',
        'your-project-plugins'
      ],
      // Entry
      main: './app/scripts/main.js'
    }
  },
  sprites: {
    image: ['img-icon'], // Icon path: './app/images/img-icon'
    svg: ['svg-icon'] //  SVG path: './app/images/svg-icon'
  },
  cache: false,
  assets: {
    root: '/path/to/your_project', // Remote project root path
    publicPath: 'public', // '/path/to/your_project/public'
    subDir: '' // `/path/to/your_project/public/${subDir}`
  }
};

// 3. Run balm
balm.go(function(mix) {
  if (balm.config.production) {
    // Publish assets(styles,scripts,images,fonts,media)
    // to `${assets.root}/${assets.publicPath}/${assets.subDir}`
    mix.publish();

    // Publish a template:
    // from `${roots.source}/index.html`
    // to `${assets.root}/views/index.blade.php`
    mix.publish('index.html', 'views', {
      basename: 'yourFilename',
      suffix: '.blade',
      extname: '.php'
    });
  }
});
