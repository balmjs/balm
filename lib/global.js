// Dependencies
import path from 'path';
import { task, series, parallel, src, dest } from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import cssnano from 'cssnano';
import webpack from 'webpack';

import { version } from '../package.json';
import { toNamespace } from './utilities';
import BalmLogger from './utilities/logger';
import BalmFile from './utilities/file';
import BalmTask from './tasks/task';
import BalmApi from './api';

// Dependencies' functions
const $ = gulpLoadPlugins();
const server = browserSync.create();
const noop = () => {};

// Global BalmJS variables
const NAMESPACE = 'balm';
const TIME_FLAG = 'BalmJS Time';

const BalmJS = {
  version,
  NAMESPACE,
  TIME_FLAG,
  tasks: [],
  mixins: new BalmApi(),
  recipes: [],
  recipeIndex: 0,
  beforeTask: noop,
  afterTask: noop,
  noop
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
global.server = server;
global.del = del;
global.cssnano = cssnano;
global.webpack = webpack;
// Custom
global.BalmJS = BalmJS;
global.config = require('./config/index').default;
global.logger = new BalmLogger();
global.toNamespace = toNamespace;
global.BalmFile = BalmFile;
global.BalmTask = BalmTask;

// Show version
console.log(`BalmJS version: ${BalmJS.version}`);
