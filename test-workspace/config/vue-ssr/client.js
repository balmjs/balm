const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
const balmrc = require('../balmrc');

const scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'vuex', 'axios'],
    client: './vue-ssr/app/scripts/entry-client.js'
  }
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
      historyOptions: {
        index: '/server.html' // NOTE: entry template
      }
    },
    roots: {
      source: 'vue-ssr/app'
    },
    scripts,
    assets: {
      cache: true
    },
    logs: {
      level: 2
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
    balmConfig.scripts.inject = true;
  }

  return balmConfig;
};

const api = (mix) => {
  if (mix.env.isProd) {
    mix.remove('dist/server.html');
  }
};

module.exports = (balm) => {
  return {
    config: getConfig(balm),
    api
  };
};
