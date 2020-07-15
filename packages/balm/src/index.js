import path from 'path';
import fs from 'fs';
import globalDirectories from 'global-dirs';

const useTslib = process.argv.includes('--balm-ts');
const lib = useTslib ? 'tslib' : 'lib';

const localBalmCore = path.join(__dirname, '..', '..', '@balm/core', lib);
const globalBalmCore = path.join(
  globalDirectories.npm.packages,
  '@balm/core',
  lib
);

let balmCore = path.join(__dirname, '..', '..', 'core', lib);
if (fs.existsSync(localBalmCore)) {
  balmCore = localBalmCore;
} else if (fs.existsSync(globalBalmCore)) {
  balmCore = globalBalmCore;
} else {
  console.warn('[BalmJS]', '`@balm/core` not found :(');
}

let balm;
if (fs.existsSync(balmCore)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  balm = require(balmCore).default;
}

module.exports = balm;

export default balm;
