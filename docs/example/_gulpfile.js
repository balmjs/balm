// Balm config simple demo

// 1. Import balm
var balm = require('balm');

// 2. Config balm
balm.config = {
  server: {
    open: true,
    // Version < 0.18.0
    proxyTable: {
      '/api': {
        target: 'http://your.project.dev', // Target host
        changeOrigin: true // Needed for virtual hosted sites
      }
    },
    // Version >= 0.18.0
    proxyContext: '/api',
    proxyOptions: {
      target: 'http://your.project.dev',
      changeOrigin: true
    }
  },
  roots: {
    source: 'app', // Source code root (Create a directory named 'app' in project)
    target: 'dist' // The production build
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
      // HTML: <script src="%PUBLIC_URL%/scripts/vendor/mylib.js"></script>
      // mylib: ['your-project-vendors', 'your-project-plugins'],
      // Entry
      main: './app/scripts/main.js'
    }
  },
  // Sprite config
  // sprites: {
  //   image: ['img-icon'], // Icon path: './app/images/img-icon'
  //   svg: ['svg-icon'] //  SVG path: './app/images/svg-icon'
  // },
  assets: {
    root: '/path/to/your_remote_project', // Remote project root path
    publicPath: 'public', // '/path/to/your_remote_project/public'
    subDir: '' // `/path/to/your_remote_project/public/${subDir}`
  },
  cache: false
};

// 3. Run balm
balm.go(function(mix) {
  if (balm.config.isProd) {
    // Publish assets(styles,scripts,images,fonts,media)
    // from local `${roots.target}/{css,js,img,font,media}`
    // to `${assets.root}/${assets.publicPath}/${assets.subDir}`
    mix.publish();

    // Publish html templates
    // from local `${roots.target}/index.html`
    // to remote `${assets.root}/views/index.blade.php`
    mix.publish('index.html', 'views', {
      basename: 'new-filename',
      suffix: '.blade',
      extname: '.php'
    });
  }
});
