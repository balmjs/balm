import path from 'node:path';
import fs from 'node:fs';
// import { createRequire } from 'node:module';

const balmEnvFile = path.join(process.cwd(), 'balm.env.js');

const getBalmEnv = async () => {
  if (fs.existsSync(balmEnvFile)) {
    await import(balmEnvFile);

    if (process.env.USE_LOCAL_WEBPACK) {
      // const require = createRequire(import.meta.url);
      // process.env.WEBPACK = require.resolve('webpack');
      process.env.WEBPACK = path.resolve(
        fs.realpathSync(process.cwd()),
        'node_modules',
        'webpack/lib/index.js'
      );
    }
  }
};

export default getBalmEnv;
