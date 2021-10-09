const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

console.info('balm@ftp');

const config = {
  workspace,
  useDefaults: false,
  roots: {
    source: 'ftp/awesome'
  },
  ftp: {
    options: {
      host: '',
      username: '',
      password: '',
      remotePath: '/var/www/test'
    },
    watchFiles: [
      'ftp/awesome/application/modules/views/**/*',
      'ftp/awesome/www/modules/user/**/*'
    ]
  },
  logs: {
    level: 2
  }
};

const api = (mix) => {
  mix.ftp([
    'ftp/awesome/application/modules/views/**/*',
    'ftp/awesome/www/modules/user/**/*'
  ]);
};

module.exports = () => {
  return {
    config,
    api
  };
};
