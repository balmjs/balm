import path from 'path';
import balm from './balm';

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

console.info('balm@zero');

balm.config = {
  workspace,
  // useDefaults: false,
  // styles: {
  //   sprites: ['icons', 'mdi']
  // },
  assets: {
    cache: true
  }
};

balm.go(mix => {
  // mix.sprite();

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
