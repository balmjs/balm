// Dependencies
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';

import config from './config/index';
import logger from './helpers/logger';
import File from './helpers/file';
import Task from './task';
import Api from './api';

// Dependencies' functions
const $ = gulpLoadPlugins();

// Global BalmJS variables
const BALMJS = {
  version: require('../package.json').version,
  tasks: [],
  taskNames: [],
  mixins: new Api(),
  recipeIndex: 0,
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
global.config = config;
global.logger = logger;
global.File = File;
global.Task = Task;

// Show version
$.util.log(`BalmJS version: ${BALMJS.version}`);
