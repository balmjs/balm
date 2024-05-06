import { createRequire } from 'node:module';
import gulp from 'gulp';
import getBalmCoreModule from './balm-core-module.js';
import checkVersion from '../check-version.js';
import { isWindows, dynamicImport } from './utils.js';

const canaryVersion = /^[4-5]\.0\.0-/;
const nextVersion = /^[4-5]\.[0-9]+\.[0-9]+$/;

const getBalmCore = async () => {
  const balmCoreModule = getBalmCoreModule();
  let balmCore = isWindows
    ? await dynamicImport(balmCoreModule, false)
    : await import(balmCoreModule); // Load `balm-core`

  const version = balmCore.version;
  checkVersion(version);

  const isESM = nextVersion.test(version) || canaryVersion.test(version);
  if (!isESM) {
    // Compatibility For `balm-core < 4`
    const requireModule = createRequire(import.meta.url);
    balmCore = requireModule(balmCoreModule);
  }

  const balm = balmCore.default;
  const run = () => !isESM && gulp.parallel('balm:default')();

  return {
    balm,
    run
  };
};

export default getBalmCore;
