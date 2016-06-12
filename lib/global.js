const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

global.gulp = gulp;
global.$ = $;
global.browserSync = browserSync;
global.del = del;
global.wiredep = wiredep;
global.reload = reload;
global.config = require('./config').default;
global.noop = () => {};
global.mix = {};
