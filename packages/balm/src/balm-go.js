import path from 'path';
import { argv } from 'yargs';
import fs from 'fs';
import gulp from 'gulp';
import balm from './index';
import { title, message } from './config';

const balmCwd = process.env.BALM_CWD || process.cwd();
const balmConfigFile = path.join(balmCwd, argv.config || 'balm.config.js');

const runInDevelopment = Object.keys(argv).length === 2;
const runInProduction =
  Object.keys(argv).length > 2 && (argv.p || argv.production);

function run() {
  gulp.parallel('balm:default')();
}

if (typeof argv === 'object' && !argv._.length) {
  if (runInDevelopment || runInProduction) {
    if (balmConfigFile && fs.existsSync(balmConfigFile)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const balmConfig = require(balmConfigFile);

      if (typeof balmConfig === 'function') {
        let { config, beforeTask, afterTask, api } = balmConfig(balm);

        if (config) {
          balm.config = config;

          if (beforeTask) {
            balm.beforeTask = beforeTask;
          }
          if (afterTask) {
            balm.afterTask = afterTask;
          }

          api ? balm.go(api) : balm.go();
          run();
        } else {
          console.warn(title, message.config);
        }
      } else {
        balm.config = balmConfig || {};

        balm.go();
        run();
      }
    } else {
      console.error(title, message.notFound);
      process.exit(1);
    }
  } else {
    console.log(title, message.binCommand);
  }
} else {
  console.log(title, message.binCommand);
}
