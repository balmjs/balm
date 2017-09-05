import path from 'path';

const root = path.resolve(__dirname, '..');
const workspace = path.join(root, 'test-workspace');
const assets = path.join(workspace, 'assets');

const testConfig = {
  root: root,
  workspace: workspace,
  assets: assets
};

const balmConfig = {
  production: true,
  workspace: testConfig.workspace,
  roots: {
    source: 'app',
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
  scripts: {
    // Vendor all in one
    // vendor: true,
    // cdn: {
    //   'jquery': '$',
    //   'lodash': '_',
    //   'moment': 'moment'
    // },
    entry: {
      'page-a': './app/scripts/page-a.js',
      'page-b': './app/scripts/page-b.js',
      // 'main-async': './app/scripts/main-async.js',
      'main-sync': './app/scripts/main-sync.js'
    },
    // webpack: {
    //   output: {
    //     library: 'BalmUI',
    //     libraryTarget: 'umd'
    //   }
    // },
    eslint: true,
    options: {
      compress: {
        warnings: false,
        drop_console: false
      }
    }
  },
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
    excludes: [
      'dist/web/img/icons/icon-*.png'
    ]
  }
};

export default balmConfig;
