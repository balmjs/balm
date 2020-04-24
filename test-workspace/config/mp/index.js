const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MpPlugin = require('mp-webpack-plugin');
const balm = require('../balm');
const balmrc = require('../balmrc');
const fuckMP = require('./fuck-mp');
// const pxtorem = require('postcss-pxtorem');
const publish = require('./publish');

const balmConfig = Object.assign(balmrc, {
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
      lib: ['vue', 'balm-ui'],
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
            new MpPlugin(require('./kbone.config'))
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
  assets: {
    subDir: balm.config.env.isMP ? '' : 'h5',
    cache: !balm.config.env.isMP
  }
});

balm.config = balmConfig;

balm.go(mix => {
  if (mix.env.isMP) {
    fuckMP(mix);
  } else {
    publish(mix);
  }
});
