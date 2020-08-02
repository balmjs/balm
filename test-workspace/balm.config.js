const path = require('path');

console.info('balm@zero');

const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');

const config = {
  workspace,
  // useDefaults: false,
  styles: {
    extname: 'scss',
    dartSass: true
    // sprites: ['icons', 'mdi']
  },
  scripts: {
    esbuild: true,
    lint: true
  },
  images: {
    plugins: {
      jpeg: false,
      png: false
    }
  },
  assets: {
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
