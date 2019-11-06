import './custom-tasks';
import './utilities';
import './tasks';
import './middlewares';
import './bundler';
import './bootstrap/index.spec';
import './app';

const balmConfigDefaults = Object.assign({}, balm.config, {
  env: {
    isProd: false,
    isDev: false,
    inSSR: false
  },
  paths: {
    target: {
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font',
      media: 'media'
    }
  },
  styles: {
    extname: 'css',
    sprites: []
  },
  scripts: {
    loaders: [],
    target: 'web',
    externals: false,
    inject: false,
    splitAllVendors: false,
    bundleAnalyzerReport: false,
    extractCss: {
      enabled: false
    }
  },
  extras: {
    includes: [],
    excludes: []
  },
  assets: {
    publicUrl: '',
    root: path.join(balm.config.workspace, 'assets'),
    subDir: '',
    cache: false,
    includes: [],
    excludes: []
  },
  server: {
    proxyConfig: false,
    historyOptions: false
  },
  pwa: {
    enabled: false
  },
  logs: {
    level: 3
  }
});

afterEach(function() {
  balm.config = balmConfigDefaults;
  balm.reset();
});
