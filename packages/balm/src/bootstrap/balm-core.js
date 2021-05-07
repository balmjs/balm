import getBalmCoreModule from './balm-core-module.js';
import checkVersion from '../check-version.js';

const getBalmCore = async () => {
  const balmCoreModule = await import(getBalmCoreModule()); // Load `balm-core`

  checkVersion(balmCoreModule.version);

  return balmCoreModule.default;
};

export default getBalmCore;
