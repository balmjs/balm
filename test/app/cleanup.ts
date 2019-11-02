import { sync as del } from 'rimraf';

function cleanup() {
  // del(`${balm.config.workspace}/copy-dest`);
  del(`${balm.config.workspace}/.tmp`);
  // del(`${balm.config.workspace}/.compile`);
  del(`${balm.config.workspace}/dist`);
  // del(`${balm.config.workspace}/assets`);
  del(`${balm.config.workspace}/archive.zip`);
  del(`${balm.config.workspace}/new-archive.zip`);
}

export default cleanup;
