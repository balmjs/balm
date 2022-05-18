const devWithMP = process.argv.includes('--with-mp');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MpPlugin = require('mp-webpack-plugin');
const { src, dest, parallel } = require('gulp');
const { spawn } = require('child_process');
const env = require('../env');
const balmrc = require('../balmrc');
// const pxtorem = require('postcss-pxtorem');
const publish = require('./balm.publish');

const getConfig = (balm) => {
  const { isMP, isDev } = balm.config.env;

  const config = Object.assign(balmrc, {
    server: {
      next: () => {
        if (!isMP && devWithMP) {
          spawn('npm', ['run', 'mp:dev'], { stdio: 'inherit' });
        }
      }
    },
    roots: {
      source: 'mp',
      tmp: isMP ? '.mp' : '.tmp',
      target: isMP ? 'dist/mp' : 'dist/web'
    },
    styles: {
      extname: 'scss'
      // postcssPlugins: [
      //   pxtorem({
      //     rootValue: 37.5,
      //     propList: ['*', '!font*']
      //   })
      // ]
    },
    scripts: {
      entry: {
        lib: ['vue', 'kbone-api'],
        main: isMP ? './mp/scripts/main.mp.js' : './mp/scripts/main.js'
      },
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ],
      plugins: [
        new VueLoaderPlugin(),
        ...(isMP
          ? [
              new webpack.DefinePlugin({
                'process.env': {
                  isMiniprogram: process.env.isMiniprogram
                }
              }),
              new MpPlugin(require('./wx.kbone.config'))
            ]
          : [])
      ],
      // extractCss: {
      //   enabled: env.isProd,
      //   prefix: 'extra-'
      // },
      alias: {
        '@': env.resolve('mp/scripts'),
        vue$: 'vue/dist/vue.esm.js'
        // 'balm-ui': 'balm-ui/src/scripts/balm-ui.js',
        // 'balm-ui-plus': 'balm-ui/src/scripts/balm-ui-plus.js',
        // 'balm-ui-next': 'balm-ui/src/scripts/balm-ui-next.js'
      }
    },
    assets: isMP
      ? {}
      : {
          subDir: 'h5',
          cache: true,
          excludes: ['dist/web/h5/1a/reset.css']
        }
  });

  if (isMP && isDev) {
    config.useDefaults = false;
    config.styles.minify = true; // Fuck MP sourcemap bug
    config.styles.options = {
      minifySelectors: false // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
    };
    config.scripts.minify = true; // 开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩
  }

  return config;
};

const tmpRoot = '.mp';
const wxssEntry = './mp/wx-pages/main/index.wxss';

function syncWxss() {
  return src(wxssEntry).pipe(dest(`${tmpRoot}/pages/main`));
}

const api = (mix) => {
  let { isMP, isDev, isProd } = mix.env;

  if (isMP) {
    const mpDir = isProd ? './dist/mp' : tmpRoot;
    const mpCommonDir = `${mpDir}/common`;

    // sync wxss entry
    mix.copy(wxssEntry, `${mpDir}/pages/main`);

    if (isDev) {
      mix.serve((watcher, reload) => {
        watcher.on('change', (file) => {
          const extname = file.split('.')[1];

          if (extname === 'scss') {
            mix.sass('mp/styles/main.scss', `${mpCommonDir}/1a`);
          }

          if (extname === 'js' || extname === 'vue') {
            mix.webpack(
              {
                main: './mp/scripts/main.mp.js'
              },
              `${mpCommonDir}/2b`,
              {},
              () => {
                parallel(syncWxss)();
              }
            );
          }
        });
      });
    }
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
