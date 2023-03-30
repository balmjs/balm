import path from 'node:path';
import fs from 'node:fs';
import { isWindows, dynamicImport } from './utils.js';

const balmEnvFile = path.join(process.cwd(), 'balm.env.js');
const webpackLocalModule = path.resolve(
  fs.realpathSync(process.cwd()),
  'node_modules',
  'webpack/lib/index.js'
);

const getBalmEnv = async () => {
  if (fs.existsSync(balmEnvFile)) {
    isWindows ? await dynamicImport(balmEnvFile) : await import(balmEnvFile);

    if (fs.existsSync(webpackLocalModule)) {
      process.env.WEBPACK = webpackLocalModule;
    }
  }
};

export default getBalmEnv;
