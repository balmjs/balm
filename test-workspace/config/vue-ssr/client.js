const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
const balmrc = require('../balmrc');
const serve = require('./http-server');

const scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'vuex', 'axios'],
    client: './vue-ssr/app/scripts/entry-client.js'
  },
  injectHtml: true,
  htmlPluginOptions: {
    template: './vue-ssr/app/server.html'
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
      source: 'vue-ssr/app'
    },
    scripts,
    assets: {
      cache: true
    }
  });

  if (balm.config.env.isProd) {
    balm.config.html.options.removeComments = false;
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
      new webpack.DefinePlugin({
        'process.env.VUE_ENV': '"client"'
      }),
      new VueSSRClientPlugin()
    ]);
    balmConfig.scripts.useCache = true;
  }

  // console.log('client config', balmConfig);

  return balmConfig;
};

module.exports = (balm) => {
  return {
    config: getConfig(balm)
  };
};
