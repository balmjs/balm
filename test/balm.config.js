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
  useDefault: true,
  debug: true,
  production: true,
  // server: {
  //   open: false,
  //   browser: 'PhantomJS'
  // },
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
    ext: 'css'
  },
  scripts: {
    entry: {
      // lib: ['jquery'],
      main: path.join(workspace, 'app/scripts/main.js')
    },
    // vendors: ['lib'],
    vendor: true,
    eslint: true
  },
  sprites: {
    image: ['img-icon'],
    svg: ['svg-icon']
  },
  cache: true,
  assets: {
    root: testConfig.assets,
    publicPath: 'public',
    subDir: 'web'
  }
};

export default balmConfig;
