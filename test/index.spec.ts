import './custom-tasks';
// import remove from 'rimraf';
import './tasks';
import './utilities';

const balmConfigDefaults = balm.config;

const reset = () => {
  balm.config = balmConfigDefaults;
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
