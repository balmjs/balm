import balmCore from './balm-core';
import checkVersion from '../check-version';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const balmCoreModule = require(balmCore); // Load `balm-core`

checkVersion(balmCoreModule.version);

const balm = balmCoreModule.default;

export default balm;
