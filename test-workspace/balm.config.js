const path = require('path');
// const imageminPngquant = require('imagemin-pngquant');

console.info('balm@zero');

const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');

const config = {
  workspace,
  // useDefaults: false,
  styles: {
    extname: 'scss'
    // entry: 'main.dart.scss' // ['main.scss', 'main.dart.scss']
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
    // injectHtml: true,
    // htmlPluginOptions: {
    //   template: 'src/templates/default.html'
    // }
    // extractCss: true,
    alias: {
      '@balm-ui': path.join(workspace, 'node_modules/balm-ui')
    }
  },
  // images: {
  //   plugins: {
  //     png: imageminPngquant()
  //   }
  // },
  assets: {
    // mainDir: 'public',
    // subDir: 'sub',
    // virtualDir: 'virtual',
    cache: true
  },
  logs: {
    level: 1
  }
};

const api = (mix) => {
  // mix.sprite(['icons', 'mdi'], '.output/images');

  if (mix.env.isProd) {
    console.log('prod');

    // mix.publish();
    // mix.publish([
    //   {
    //     input: 'default.html',
    //     output: 'views',
    //     renameOptions: {
    //       basename: 'new-filename',
    //       suffix: '.blade',
    //       extname: '.php'
    //     }
    //   }
    // ]);
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
