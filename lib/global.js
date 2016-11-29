// dependencies
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';

// dependencies' functions
const $ = gulpLoadPlugins();
const RELOAD = browserSync.stream;

// Global BalmJS
const BALMJS = {
  Task: require('./task').default,
  tasks: [],
  mixins: {},
  collections: [],
  recipes: [],
  noop: () => {}
};

// set global variables
global.path = path;
global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.reload = RELOAD;
global.del = del;
global.webpack = webpack;
global.BalmJS = BALMJS;
global.config = require('./config').default;
global.logger = require('./logger').default;
