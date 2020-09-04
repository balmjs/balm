/* eslint-disable @typescript-eslint/no-var-requires */
import './balm-env';
import path from 'path';
import { argv } from 'yargs';
import fs from 'fs';
import gulp from 'gulp';
import { title, message } from '../config';

const balmCwd = process.env.BALM_CWD || process.cwd();
const balmConfigFile = path.join(balmCwd, argv.config || 'balm.config.js');

function run() {
  gulp.parallel('balm:default')();
}

if (balmConfigFile && fs.existsSync(balmConfigFile)) {
  const balmConfig = require(balmConfigFile);
  const balm = require('./balm');

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
