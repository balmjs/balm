import './custom-tasks';
// import remove from 'rimraf';
import './tasks';
import './utilities';

const balmConfigDefaults = balm.config;

const reset = () => {
  balm.config = balmConfigDefaults;
  balm.config.env.isProd = false;
  balm.config.env.isDev = false;
  balm.config.assets.subDir = '';
  balm.config.assets.cache = false;

  // remove.sync(`${workspace}/copy-dest`);
  // remove.sync(`${workspace}/.tmp`);
  // remove.sync(`${workspace}/.compile`);
  // remove.sync(`${workspace}/dist`);
  // remove.sync(`${workspace}/assets`);
  // remove.sync(`${workspace}/archive.zip`);
};

afterEach(() => {
  reset();
});
