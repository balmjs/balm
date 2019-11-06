import balm from './balm';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

balm.config = {
  workspace
  // useDefaults: false,
  // styles: {
  //   sprites: ['icons', 'mdi']
  // }
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
