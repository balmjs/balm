import remove from 'rimraf';
import './tasks';

beforeEach(() => {
  balm.config = balmConfig;
});

afterEach(() => {
  // remove.sync(`${workspace}/copy-dest`);
  // remove.sync(`${workspace}/.tmp`);
  // remove.sync(`${workspace}/.compile`);
  // remove.sync(`${workspace}/dist`);
  // remove.sync(`${workspace}/assets`);
  // remove.sync(`${workspace}/archive.zip`);
});
