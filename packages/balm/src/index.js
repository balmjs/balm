/* eslint-disable @typescript-eslint/no-var-requires */
import './bootstrap/balm-env'; // Load `balm.env.js`
import path from 'path';
import { argv } from 'yargs';
import fs from 'fs';
import gulp from 'gulp';
import { title, message } from './config';

const balmCwd = process.env.BALM_CWD || process.cwd();
const balmConfigFile = path.join(balmCwd, argv.config || 'balm.config.js');

function run() {
  gulp.parallel('balm:default')();
}

if (balmConfigFile && fs.existsSync(balmConfigFile)) {
  const balmConfig = require(balmConfigFile); // Load `balm.config.js`
  const balm = require('./bootstrap/balm').default; // Get `balm-core`

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
      // If balmConfig was a function, it MUST return a `config` object.
      console.error(
        title,
        `${message.config} Your \`balm.config.js\` function did not return a \`config\` object.`
      );
      process.exit(1);
    }
  } else {
    // If balmConfig is not a function, it should be an object (or falsy, handled by `|| {}`)
    if (typeof balmConfig === 'object' || !balmConfig) {
      balm.config = balmConfig || {};
    } else {
      // If it's neither a function nor an object (e.g. a string, number), it's an invalid config.
      console.error(
        title,
        `Invalid \`balm.config.js\`. Expected an object or a function, but got ${typeof balmConfig}.`
      );
      process.exit(1);
    }

    balm.go();
    run();
  }
} else {
  console.error(title, message.notFound);
  process.exit(1);
}
