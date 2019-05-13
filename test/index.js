import remove from 'rimraf';
import './tasks';

const reset = () => {
  balm.reset();
  remove.sync(`${workspace}/copy-dest`);
  remove.sync(`${workspace}/.tmp`);
  remove.sync(`${workspace}/.compile`);
  remove.sync(`${workspace}/dist`);
  remove.sync(`${workspace}/assets`);
  remove.sync(`${workspace}/archive.zip`);
};

beforeEach(() => {
  balm.config = balmConfig;
  // balm.config.isProd = false;
});

afterEach(() => {
  reset();
});
