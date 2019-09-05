import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

global.path = path;
global.gulp = gulp;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
