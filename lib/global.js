// Dependencies
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import cssnano from 'cssnano';
import webpack from 'webpack';

import { getNamespace } from './utilities';
import Logger from './utilities/logger';
import File from './utilities/file';
import Task from './task';
import Api from './api';

// Dependencies' functions
const $ = gulpLoadPlugins();
const noop = () => {};

// Global BalmJS variables
const BALMJS = {
  version: require('../package.json').version,
  namespace: 'balm',
  tasks: [],
  taskNames: new Set(),
  mixins: new Api(),
  recipeIndex: 0,
  recipes: [],
  noop,
  beforeTask: noop,
  afterTask: noop
};

// Set global variables
global.path = path;
global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.del = del;
global.cssnano = cssnano;
global.webpack = webpack;

global.BalmJS = BALMJS;
global.config = require('./config/index').default;
global.logger = new Logger();
global.getNamespace = getNamespace;
global.File = File;
global.Task = Task;

// Show version
console.log(`BalmJS version: ${BALMJS.version}`);
