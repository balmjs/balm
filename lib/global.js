// Dependencies
import path from 'path';
import { task, series, parallel, src, dest } from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import cssnano from 'cssnano';
import webpack from 'webpack';

import { getNamespace } from './utilities';
import BalmLogger from './utilities/logger';
import BalmFile from './utilities/file';
import BalmTask from './task';
import BalmApi from './api';

// Dependencies' functions
const $ = gulpLoadPlugins();
const noop = () => {};
const callback = cb => {
  cb();
};

// Global BalmJS variables
const BalmJS = {
  version: require('../package.json').version,
  namespace: 'balm',
  tasks: [],
  taskNames: new Set(),
  mixins: new BalmApi(),
  recipeIndex: 0,
  recipes: [],
  noop,
  callback,
  beforeTask: noop,
  afterTask: noop,
  TIME: 'BalmJS Time'
};

// Set global variables
// Node
global.path = path;
// Gulp
global.task = task;
global.series = series;
global.parallel = parallel;
global.src = src;
global.dest = dest;
// Vendors
global.$ = $;
global.browserSync = browserSync;
global.del = del;
global.cssnano = cssnano;
global.webpack = webpack;
// Custom
global.BalmJS = BalmJS;
global.config = require('./config/index').default;
global.logger = new BalmLogger();
global.getNamespace = getNamespace;
global.BalmFile = BalmFile;
global.BalmTask = BalmTask;

// Show version
console.log(`BalmJS version: ${BalmJS.version}`);
