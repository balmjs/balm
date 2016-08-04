const path = require('path');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

global.path = path;
global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.reload = reload;
global.config = require('./config').default;
global.Task = require('./task/task').default;
global.noop = () => {};
global.RN = '\n';
// for extension
global.mix = {};
global.collections = [];
