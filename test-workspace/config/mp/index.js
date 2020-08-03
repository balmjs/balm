const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MpPlugin = require('mp-webpack-plugin');
const balmrc = require('../balmrc');
// const pxtorem = require('postcss-pxtorem');
const publish = require('./balm.publish');

const getConfig = (balm) => {
  return Object.assign(balmrc, {
    roots: {
      source: 'mp',
      target: balm.config.env.isMP ? 'dist/mp' : 'dist/web'
    },
    styles: {
      extname: 'scss',
      dartSass: true
      // postcssPlugins: [
      //   pxtorem({
      //     rootValue: 37.5,
      //     propList: ['*', '!font*']
      //   })
      // ]
    },
    scripts: {
      entry: {
        lib: ['vue'],
        main: balm.config.env.isMP
          ? './mp/scripts/main.mp.js'
          : './mp/scripts/main.js'
      },
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ],
      plugins: [
        new VueLoaderPlugin(),
        ...(balm.config.env.isMP
          ? [
              new webpack.DefinePlugin({
                'process.env.isMiniprogram': process.env.isMiniprogram // 注入环境变量，用于业务代码判断
              }),
              new MpPlugin(require('./wx.kbone.config'))
            ]
          : [])
      ],
      // extractCss: {
      //   enabled: balm.config.env.isProd,
      //   prefix: 'extra-'
      // },
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, '..', '..', 'mp', 'scripts')
        // 'balm-ui': 'balm-ui/src/scripts',
        // 'balm-ui-plus': 'balm-ui/src/scripts/plus.js',
        // 'balm-ui-next': 'balm-ui/src/scripts/next.js'
      }
    },
    assets: balm.config.env.isMP
      ? {}
      : {
          subDir: 'h5',
          cache: true,
          excludes: ['dist/web/h5/1a/reset.css']
        }
  });
};

const api = (mix) => {
  if (mix.env.isMP) {
    // NOTE: fuck mp
  } else {
    // Clear miniprogram css
    mix.remove(['dist/web/index.wxss', 'dist/web/h5/1a/reset.css']);

    publish(mix);
  }
};

module.exports = (balm) => {
  return {
    config: getConfig(balm),
    api
  };
};
