const env = require('./config/env');
// const imageminPngquant = require('imagemin-pngquant');

console.info('balm@zero');

const config = {
  workspace: env.workspace,
  // useDefaults: false,
  styles: {
    extname: 'scss'
    // sprites: ['icons', 'mdi']
  },
  scripts: {
    // bundler: 'esbuild',
    lint: true,
    // entry: {
    //   index: './src/scripts/index.js',
    //   'page-a': './src/scripts/page-a.js',
    //   'page-b': './src/scripts/page-b.js'
    // },
    injectHtml: true,
    htmlPluginOptions: {
      template: 'src/templates/default.html'
    }
    // extractCss: true
  },
  // images: {
  //   plugins: {
  //     png: imageminPngquant()
  //   }
  // },
  assets: {
    cache: true
  },
  logs: {
    level: 2
  }
};

const api = (mix) => {
  // mix.sprite(['icons', 'mdi'], '.output/images');

  if (mix.env.isProd) {
    console.log('prod');
  } else {
    console.log('dev');

    // mix.serve((watcher, reload) => {
    //   watcher.on('change', (file) => {
    //     console.log('changed', file);

    //     let extname = file.split('.')[1];
    //     if (extname === 'css') {
    //       mix.css(file, '.test/css');
    //     }
    //     if (extname === 'js') {
    //       mix.js(`./${file}`, '.test/js');
    //       reload();
    //     }
    //   });
    // });
  }
};

module.exports = () => {
  return {
    config,
    api
  };
};
