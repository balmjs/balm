import pkg from '../package.json';
import semver from 'semver';
import { title, message } from './config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function checkVersion(balmCoreVersion) {
  if (balmCoreVersion && semver.lt(balmCoreVersion, pkg.version)) {
    console.log(title, message.outdated);
  }
}

export default checkVersion;
