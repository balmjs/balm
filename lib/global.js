// Dependencies
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';

// Dependencies' functions
const $ = gulpLoadPlugins();

// Global BalmJS
const BALMJS = {
  version: require('../package.json').version,
  Task: require('./task').default,
  tasks: [],
  mixins: {},
  collections: [],
  recipes: [],
  noop: () => {}
};

// Set global variables
global.path = path;
global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.del = del;
global.webpack = webpack;
global.BalmJS = BALMJS;
global.config = require('./config/index').default;
global.logger = require('./helpers/logger').default;

// Show version
console.log(`BalmJS version: ${BALMJS.version}`);
