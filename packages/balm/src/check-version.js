import pkg from '../package.json';
import semver from 'semver';
import colors from 'ansi-colors';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function checkVersion(balmCoreVersion) {
  if (semver.lt(balmCoreVersion, pkg.version)) {
    console.log(
      colors.bgBlueBright('BalmJS'),
      colors.yellow('A newer version of `balm-core` is available.')
    );
  }
}

export default checkVersion;
