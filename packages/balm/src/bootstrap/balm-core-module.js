import fs from 'node:fs';
import colors from 'ansi-colors';
import getBalmCoreModulePath from './balm-core-module-path.js';

const getBalmCoreModule = () => {
  let balmCore;

  const {
    BALM_CORE_PACKAGE_NAME,
    localModule,
    npmGlobalModule,
    yarnGlobalModule
  } = getBalmCoreModulePath();

  if (fs.existsSync(localModule)) {
    balmCore = localModule;
  } else if (fs.existsSync(npmGlobalModule)) {
    balmCore = npmGlobalModule;
  } else if (fs.existsSync(yarnGlobalModule)) {
    balmCore = yarnGlobalModule;
  } else {
    console.error(
      colors.bgBlueBright('BalmJS'),
      colors.yellow(`\`${BALM_CORE_PACKAGE_NAME}\` module not found :(`)
    );
    process.exit(1);
  }

  return balmCore;
};

export default getBalmCoreModule;
