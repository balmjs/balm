import path from 'path';
import fs from 'fs';

const balmEnvFile = path.join(process.cwd(), 'balm.env.js');

if (fs.existsSync(balmEnvFile)) {
  require(balmEnvFile);
}
