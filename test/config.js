import path from 'path';

const root = path.resolve(__dirname, '..');
const workspace = path.join(root, 'test-workspace');
const app = path.join(workspace, 'app');
const assets = path.join(workspace, 'assets');

const testConfig = {
  root: root,
  workspace: workspace,
  app: app,
  assets: assets
};

const balmConfig = {
  debug: true,
  useDefault: true,
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
    ext: 'css'
  },
  scripts: {
    vender: true,
    eslint: true
  },
  sprites: {
    image: ['icon'],
    svg: ['icon']
  },
  cache: true,
  assets: {
    root: testConfig.assets,
    publicPath: 'public',
    subDir: ''
  }
};

export default balmConfig;
