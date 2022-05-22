const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
const balmrc = require('../balmrc');
const serve = require('./http-server');

const scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'vuex', 'axios'],
    client: './vue2-ssr/app/scripts/entry-client.js'
  },
  injectHtml: true,
  htmlPluginOptions: {
    template: './vue2-ssr/app/templates/index.html',
    minify: {
      removeComments: false
    }
  },
  extractCss: true
});

const getConfig = (balm) => {
  const balmConfig = Object.assign(balmrc, {
    server: {
      proxyConfig: {
        context: '/api',
        options: {
          target: 'http://localhost:8088',
          changeOrigin: true
        }
      },
      next() {
        if (balm.config.env.isDev) {
          serve();
        }
      }
    },
    roots: {
      source: 'vue2-ssr/app'
    },
    html: {
      options: {
        removeComments: false
      }
    },
    scripts,
    assets: {
      cache: true
    }
  });

  if (balm.config.env.isProd) {
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
      new VueSSRClientPlugin()
    ]);
    balmConfig.scripts.nodeEnv = {
      VUE_ENV: 'client'
    };
  }

  // console.log('client config', balmConfig);

  return balmConfig;
};

module.exports = (balm) => {
  return {
    config: getConfig(balm)
  };
};
