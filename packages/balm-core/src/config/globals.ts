import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import through2 from 'through2';
import PluginError from 'plugin-error';
import fs from 'fs';

// Set gulp for runtime env
const gulpRuntimePath = `${process.cwd()}/node_modules/gulp/index.js`;

if (!fs.existsSync(gulpRuntimePath)) {
  console.error('[BalmJS]', '`gulp` module not found :(');
  process.exit(1);
}

global.gulp = require(gulpRuntimePath);
global.path = path;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
global.webpack = webpack;
global.through2 = through2;
global.PluginError = PluginError;
global.BalmJS = {} as any;
