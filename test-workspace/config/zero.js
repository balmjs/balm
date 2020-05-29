const path = require('path');
const balm = require('./balm');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

console.info('balm@zero');

balm.config = {
  workspace,
  // useDefaults: false,
  styles: {
    extname: 'scss',
    dartSass: true
    // sprites: ['icons', 'mdi']
  },
  scripts: {
    lint: true
  },
  images: {
    defaultPlugins: {
      // jpeg: false,
      // png: false
    }
  },
  assets: {
    cache: true
  }
  // logs: {
  //   level: 2
  // }
};

balm.go((mix) => {
  // mix.sprite(['icons', 'mdi'], '.output/images');

  if (mix.env.isProd) {
    console.log('prod');
  } else {
    console.log('dev');

    // mix.serve((watcher, reload) => {
    //   watcher.on('change', file => {
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
});
