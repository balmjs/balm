import path from 'path';

import jsConfig from './main-sync';
// import jsConfig from './main-async';
// import jsConfig from './vendor-all'; // Just for production
// import jsConfig from './vendor-custom';
// import jsConfig from './cdn';
// import jsConfig from './extract-css';

const scripts = Object.assign(
  {},
  {
    eslint: true,
    options: {
      compress: {
        drop_console: false
      }
    }
  },
  jsConfig
);

const root = path.resolve(__dirname, '..', '..');
const workspace = path.join(root, 'test-workspace');
const assets = path.join(workspace, 'assets');

const testConfig = {
  root: root,
  workspace: workspace,
  assets: assets
};

const balmConfig = {
  production: true,
  server: {
    open: false
  },
  workspace: testConfig.workspace,
  roots: {
    source: 'src',
    target: 'dist'
  },
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts'
    },
    target: {
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font'
    }
  },
  styles: {
    ext: 'css',
    autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
  },
  scripts,
  sprites: {
    image: ['img-icon'],
    svg: ['svg-icon']
  },
  cache: true,
  assets: {
    publicUrl: '/',
    root: testConfig.assets,
    publicPath: 'public',
    subDir: 'web',
    // Extra cache files
    // includes: [
    //   'dist/web/css/vendor.css',
    //   'dist/web/js/vendors/jquery.js',
    //   'dist/web/js/vendors/lodash.js'
    // ],
    excludes: ['dist/web/img/icons/icon-*.png']
  }
};

export default balmConfig;
