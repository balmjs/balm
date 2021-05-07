import path from 'node:path';
import fs from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { title, message } from '../config.js';

const balmCwd = process.env.BALM_CWD || process.cwd();
const balmConfigFile = path.join(
  balmCwd,
  yargs(hideBin(process.argv)).argv.config || 'balm.config.js'
);

const setBalmConfig = async (callback) => {
  if (balmConfigFile && fs.existsSync(balmConfigFile)) {
    const balmConfig = await import(balmConfigFile); // Load `balm.config.js`

    callback(balmConfig.default);
  } else {
    console.error(title, message.notFound);
    process.exit(1);
  }
};

export default setBalmConfig;
