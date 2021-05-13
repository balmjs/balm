import { createRequire } from 'node:module';
import gulp from 'gulp';
import getBalmCoreModule from './balm-core-module.js';
import checkVersion from '../check-version.js';

const getBalmCore = async () => {
  const balmCoreModule = getBalmCoreModule();
  let balmCore = await import(balmCoreModule); // Load `balm-core`

  const version = balmCore.version;
  checkVersion(version);

  const isESM = /^4\.0\.0-/.test(version);
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
