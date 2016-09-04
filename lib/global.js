// npm dependencies
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';

// dependencies' functions
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Global BalmJS
let BalmJS = {
  Task: require('./task').default,
  mix: {},
  collections: []
};

// set global variables
global.path = path;
global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.reload = reload;
global.del = del;
global.webpack = webpack;
global.BalmJS = BalmJS;
global.config = require('./config').default;
