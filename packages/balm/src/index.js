import './balm-env';
import fs from 'fs';
import balmCore from './balm-core';
import checkVersion from './check-version';

let balm;

if (balmCore && fs.existsSync(balmCore)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const balmCoreModule = require(balmCore);
  checkVersion(balmCoreModule.version);
  balm = balmCoreModule.default;
}

module.exports = balm;

export default balm;
