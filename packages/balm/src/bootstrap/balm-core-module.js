import path from 'path';
import globalDirectories from 'global-dirs';

const BALM_CORE_PACKAGE_NAME = 'balm-core';

const useTslib = process.env.BALM_TS || process.argv.includes('--balm-ts');
const lib = useTslib ? 'tslib' : 'lib';

const localModule = process.env.BALM_CORE
  ? path.join(process.env.BALM_CORE, lib)
  : path.join(process.cwd(), 'node_modules', BALM_CORE_PACKAGE_NAME, lib);
const npmGlobalModule = path.join(
  globalDirectories.npm.packages,
  BALM_CORE_PACKAGE_NAME,
  lib
);
const yarnGlobalModule = path.join(
  globalDirectories.yarn.packages,
  BALM_CORE_PACKAGE_NAME,
  lib
);

export {
  BALM_CORE_PACKAGE_NAME,
  localModule,
  npmGlobalModule,
  yarnGlobalModule
};
