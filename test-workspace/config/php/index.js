import balm from '../../../dist'; // from local
// import balm from 'balm'; // from node_modules

const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const workspace = path.join(root, 'test-workspace');

balm.config = {
  debug: true,
  static: false, // for PHP framework
  server: {
    open: false,
    proxy: 'your.project.local'
  },
  workspace,
  roots: {
    source: 'resources'
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
      app: './resources/assets/js/app.js'
    }
  },
  assets: {
    publicUrl: '/',
    root: '/Users/yiban/www/elf-mouse/balm/test-workspace',
    mainDir: 'public',
    subDir: 'mobile'
  },
  cache: true
};

balm.go();
