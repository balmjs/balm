declare module 'async';
declare module 'autoprefixer';
declare module 'browser-sync';
declare module 'connect-history-api-fallback';
declare module 'cssnano';
declare module 'fancy-log';
declare module 'gulp';
declare module 'gulp-load-plugins';
declare module 'http-proxy-middleware';
declare module 'optimize-css-assets-webpack-plugin';
declare module 'merge-stream';
declare module 'mini-css-extract-plugin';
declare module 'mkdirp';
declare module 'modernizr';
declare module 'parents';
declare module 'postcss-import';
declare module 'postcss-preset-env';
declare module 'postcss-safe-parser';
declare module 'require-dir';
declare module 'ssh2';
declare module 'terser-webpack-plugin';
declare module 'through2';
declare module 'webpack';
declare module 'webpack-bundle-analyzer';
declare module 'webpack-dev-middleware';
declare module 'webpack-hot-middleware';
declare module 'webpack-merge';

interface Gulp {
  src: any;
  dest: any;
  lastRun: any;
  series: any;
  parallel: any;
  watch: any;
  task: any;
  tree: any;
}

declare namespace NodeJS {
  interface Global {
    gulp: Gulp;
    $: any;
    server: any;
    webpack: any;
  }
}

declare var gulp: Gulp;
declare var $: any;
declare var server: any;
declare var webpack: any;
