import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import through2 from 'through2';
import PluginError from 'plugin-error';

global.path = path;
global.gulp = gulp;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
global.webpack = webpack;
global.through2 = through2;
global.PluginError = PluginError;
global.BalmJS = {};
