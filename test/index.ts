import './utilities';
import './tasks';
import './middlewares';
import './bundler';
import './bootstrap/config_check.spec';
import './bootstrap/index.spec';
import './app';
import './app/hooks';

const balmConfigDefaults = Object.assign(
  {},
  {
    env: {
      isProd: false,
      isDev: false,
      inSSR: false,
      isMP: false,
      inDesktopApp: false
    },
    inFrontend: true,
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
      bundler: 'webpack',
      entry: '',
      library: '',
      libraryTarget: 'var',
      loaders: [],
      plugins: [],
      injectHtml: false,
      htmlPluginOptions: {},
      extractCss: false,
      sourceMap: false,
      target: ['web', 'es5'],
      externals: false,
      extractAllVendors: false,
      bundleAnalyzerReport: false,
      useCache: false
    },
    extras: {
      includes: [],
      excludes: []
    },
    assets: {
      publicUrl: '',
      root: path.join(balm.config.workspace, 'assets'),
      subDir: '',
      buildDir: 'build',
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
  }
);

afterEach(function () {
  balm.config = balmConfigDefaults;
  balm.reset();
});
