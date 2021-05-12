import { createRequire } from 'node:module';
import semver from 'semver';
import { title, message } from './config.js';

const requireModule = createRequire(import.meta.url);
const balmPkg = requireModule('../package.json');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function checkVersion(balmCoreVersion) {
  if (balmCoreVersion && semver.lt(balmCoreVersion, balmPkg.version)) {
    // For `balm-core` < `balm`
    console.log(title, message.outdated);
  }
}

export default checkVersion;
