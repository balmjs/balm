import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import webpack from 'webpack';

global.path = path;
global.gulp = gulp;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
global.webpack = webpack;
