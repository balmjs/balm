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
    isDev: false
  },
  paths: {
    target: {
      media: 'media'
    }
  },
  styles: {
    sprites: []
  },
  scripts: {
    inject: false,
    extractCss: {
      enabled: false
    }
  },
  assets: {
    cache: false
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
});
