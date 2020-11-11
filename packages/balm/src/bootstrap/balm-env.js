import path from 'path';
import fs from 'fs';

const balmEnvFile = path.join(process.cwd(), 'balm.env.js');

if (fs.existsSync(balmEnvFile)) {
  require(balmEnvFile);

  if (process.env.USE_LOCAL_WEBPACK) {
    process.env.WEBPACK = require.resolve('webpack');
  }
}
