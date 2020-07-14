import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import through2 from 'through2';
import PluginError from 'plugin-error';

const gulpRuntimePath = `${process.cwd()}/node_modules/gulp/index.js`;

global.path = path;
global.gulp = fs.existsSync(gulpRuntimePath) ? require(gulpRuntimePath) : gulp;
global.$ = gulpLoadPlugins();
global.server = browserSync.create();
global.webpack = webpack;
global.through2 = through2;
global.PluginError = PluginError;
global.BalmJS = {} as any;
