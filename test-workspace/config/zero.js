import balm from './balm';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

balm.config = {
  workspace
};

balm.go(mix => {
  if (mix.env.isProd) {
    console.log('prod');
  } else {
    console.log('dev');

    // mix.serve((watcher, reload) => {
    // watcher.on('change', file => {
    // console.log('changed', file);
    // mix.ftp(file, {
    //   ftpOptions: {
    //     host: '',
    //     username: '',
    //     password: '',
    //     remotePath: '/var/www/ftp-test'
    //   },
    //   gulpSrcOptions: {
    //     base: '.'
    //   }
    // });
    // mix.sass(file, '.test/css', {
    //   gulpSrcOptions: {
    //     base: 'src/www/sass'
    //   }
    // });
    // let exname = file.split('.')[1];
    // if (exname === 'css') {
    //   mix.css(file, '.tmp/css');
    // }
    // if (exname === 'js') {
    //   mix.js(`./${file}`, '.tmp/js');
    //   reload();
    // }
    // });
    // });
  }
});
