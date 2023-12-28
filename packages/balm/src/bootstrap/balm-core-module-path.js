import path from 'node:path';
import globalDirectory from 'global-directory';

const BALM_CORE_PACKAGE_NAME = 'balm-core';

const getBalmCoreModulePath = () => {
  const useTslib = process.env.BALM_TS || process.argv.includes('--balm-ts');
  const lib = useTslib ? 'tslib/index.js' : 'lib/index.js';

  const localModule = process.env.BALM_CORE
    ? path.join(process.env.BALM_CORE, lib)
    : path.join(process.cwd(), 'node_modules', BALM_CORE_PACKAGE_NAME, lib);
  const npmGlobalModule = path.join(
    globalDirectory.npm.packages,
    BALM_CORE_PACKAGE_NAME,
    lib
  );
  const yarnGlobalModule = path.join(
    globalDirectory.yarn.packages,
    BALM_CORE_PACKAGE_NAME,
    lib
  );

  return {
    BALM_CORE_PACKAGE_NAME,
    localModule,
    npmGlobalModule,
    yarnGlobalModule
  };
};

export default getBalmCoreModulePath;
