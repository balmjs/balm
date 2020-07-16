import fs from 'fs';
import {
  BALM_CORE_PACKAGE_NAME,
  localModule,
  npmGlobalModule,
  yarnGlobalModule
} from './config';

let balmCore;

if (fs.existsSync(localModule)) {
  balmCore = localModule;
} else if (fs.existsSync(npmGlobalModule)) {
  balmCore = npmGlobalModule;
} else if (fs.existsSync(yarnGlobalModule)) {
  balmCore = yarnGlobalModule;
} else {
  console.warn('[BalmJS]', `${BALM_CORE_PACKAGE_NAME} module not found :(`);
}

export default balmCore;
