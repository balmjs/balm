#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const { argv } = require('yargs');
const fs = require('fs');
const colors = require('ansi-colors');
const balm = require('../lib');

const balmCwd = process.env.BALM_CWD || process.cwd();
const balmConfigFile = argv.config || `${balmCwd}/balm.config.js`;

function run() {
  gulp.parallel('default')();
}

if (balmConfigFile && fs.existsSync(balmConfigFile)) {
  const balmConfig = require(balmConfigFile);

  if (typeof balmConfig === 'function') {
    let { config, beforeTask, afterTask, recipe } = balmConfig();

    if (config) {
      balm.config = config;

      if (beforeTask) {
        balm.beforeTask = beforeTask;
      }
      if (afterTask) {
        balm.afterTask = afterTask;
      }

      recipe ? balm.go(recipe) : balm.go();
      run();
    } else {
      console.warn(
        colors.bgBlueBright('<BalmJS>'),
        colors.yellow('`config` is required')
      );
    }
  } else {
    balm.config = balmConfig || {};

    balm.go();
    run();
  }
} else {
  console.error(
    colors.bgBlueBright('<BalmJS>'),
    colors.yellow('`balm.config.js` not found :(')
  );
  process.exit(1);
}
