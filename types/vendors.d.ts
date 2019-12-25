declare module 'async';
declare module 'autoprefixer';
declare module 'browser-sync';
declare module 'connect-history-api-fallback';
declare module 'cssnano';
declare module 'fancy-log';
declare module 'gulp';
declare module 'gulp-load-plugins';
declare module 'html-minifier';
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
declare module 'workbox-build';

interface Gulp {
  src: (globs: string | string[], options?: object) => any;
  dest: (directory: string | Function, options?: object) => any;
  lastRun: (task: string | Function, precision?: number) => any;
  series: any;
  parallel: any;
  watch: (
    globs: string | string[],
    options?: object,
    task?: string | Function
  ) => any;
  task: (taskName: string, taskFunction: Function) => any;
  tree: (options?: object) => any;
}

declare namespace NodeJS {
  interface Global {
    gulp: Gulp;
    $: any;
    server: any;
    webpack: any;
    through2: any;
    PluginError: any;
  }
}

declare const gulp: Gulp;
declare const $: any;
declare const server: any;
declare const webpack: any;
declare const through2: any;
declare const PluginError: any;
