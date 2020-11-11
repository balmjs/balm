import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import through2 from 'through2';
import PluginError from 'plugin-error';
import fs from 'fs';
import colors from 'ansi-colors';

// Set env var for ORIGINAL cwd before anything touches it
process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const gulpModule = `${
  process.env.BALM || process.env.BALM_CWD
}/node_modules/gulp/index.js`;
const webpackModule = process.env.WEBPACK || require.resolve('webpack');

if (!fs.existsSync(gulpModule)) {
  console.error(
    colors.bgBlueBright('BalmJS'),
    colors.yellow('`balm` module not found :(')
  );
  process.exit(1);
}

// Chdir before requiring balm config to make sure
// we let them chdir as needed
if (process.cwd() !== process.env.BALM_CWD) {
  process.chdir(process.env.BALM_CWD);
}

global.gulp = require(gulpModule);
global.path = path;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
global.webpack = require(webpackModule);
global.through2 = through2;
global.PluginError = PluginError;
