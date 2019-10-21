import './custom-tasks';
// import remove from 'rimraf';
import './tasks';
import './utilities';

const balmConfigDefaults = Object.assign({}, balm.config, {
  env: {
    isProd: false,
    isDev: false
  },
  paths: {
    target: {
      media: 'media'
    }
  },
  styles: {
    sprites: []
  },
  assets: {
    cache: false
  },
  logs: {
    level: 3
  }
});

const reset = () => {
  balm.config = balmConfigDefaults;

  // remove.sync(`${workspace}/copy-dest`);
  // remove.sync(`${workspace}/.tmp`);
  // remove.sync(`${workspace}/.compile`);
  // remove.sync(`${workspace}/dist`);
  // remove.sync(`${workspace}/assets`);
  // remove.sync(`${workspace}/archive.zip`);
};

// beforeEach(() => {});

afterEach(() => {
  reset();
});
