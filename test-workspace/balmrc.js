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
  scripts: {
    // Vendor all in one
    // vendor: true,
    // cdn: {
    //   'jquery': '$',
    //   'lodash': '_',
    //   'moment': 'moment',
    //   'zepto': '$'
    // },
    entry: {
      // 'page-a': './src/scripts/page-a.js',
      // 'page-b': './src/scripts/page-b.js',
      // 'main-async': './src/scripts/main-async.js',
      'main-sync': './src/scripts/main-sync.js'
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
