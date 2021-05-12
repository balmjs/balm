import { createRequire } from 'node:module';
import getBalmCoreModule from './balm-core-module.js';
import checkVersion from '../check-version.js';

const getBalmCore = async () => {
  const balmCoreModule = getBalmCoreModule();
  let balmCore;

  try {
    balmCore = await import(balmCoreModule); // Load `balm-core`
  } catch (e) {
    // For `balm-core < 4`
    const requireModule = createRequire(import.meta.url);
    balmCore = requireModule(balmCoreModule);
  }

  const balm = balmCore.default;

  checkVersion(balm.version);

  return balm;
};

export default getBalmCore;
