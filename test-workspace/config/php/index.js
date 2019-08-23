const balmrc = require('../balmrc');

const balm = balmrc.balm;
let balmConfig = balmrc.balmConfig;

balmConfig = Object.assign(balmConfig, {
  static: false, // for PHP framework
  server: {
    open: false,
    proxy: 'your.project.local'
  },
  roots: {
    source: 'php/resources'
  },
  paths: {
    source: {
      base: 'assets',
      html: 'views',
      css: 'assets/sass',
      js: 'assets/js',
      img: 'assets/images',
      font: 'assets/fonts',
      media: 'assets/media'
    }
  },
  styles: {
    ext: 'scss'
  },
  scripts: {
    entry: {
      app: './php/resources/assets/js/app.js'
    }
  },
  assets: {
    publicUrl: '/',
    root: '/Users/yiban/www/elf-mouse/balm/test-workspace',
    mainDir: 'public',
    subDir: 'mobile'
  },
  cache: true,
  ftp: {
    options: {
      host: '',
      username: '',
      password: '',
      remotePath: '/web/balm-ftp-test',
      logging: true
    },
    watchFiles: ['./resources/**/*']
  },
  useDefault: false
});

balm.config = balmConfig;

balm.go(mix => {
  mix.ftp('./php/resources/assets/**/*');
});
