declare module 'async';
declare module 'autoprefixer';
declare module 'browser-sync';
declare module 'connect-history-api-fallback';
declare module 'cssnano';
declare module 'detect-port';
declare module 'fancy-log';
declare module 'fibers';
declare module 'gulp';
declare module 'gulp-load-plugins';
declare module 'html-minifier';
declare module 'istextorbinary';
declare module 'optimize-css-assets-webpack-plugin';
declare module 'merge-stream';
declare module 'mini-css-extract-plugin';
declare module 'mkdirp';
declare module 'modernizr';
declare module 'parents';
declare module 'postcss-import';
declare module 'postcss-preset-env';
declare module 'postcss-safe-parser';
declare module 'readable-stream';
declare module 'require-dir';
declare module 'rimraf'; // For test
declare module 'sass';
declare module 'ssh2';
declare module 'terser-webpack-plugin';
declare module 'through2';
declare module 'webpack';
declare module 'webpack-bundle-analyzer';
declare module 'webpack-dev-middleware';
declare module 'webpack-hot-middleware';
declare module 'webpack-merge';
declare module 'workbox-build';

declare module '*.json' {
  const file: any;
  export default file;
}
