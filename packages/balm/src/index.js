import fs from 'fs';
import balmCore from './balm-core';

let balm;

if (balmCore && fs.existsSync(balmCore)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  balm = require(balmCore).default;
}

module.exports = balm;

export default balm;
