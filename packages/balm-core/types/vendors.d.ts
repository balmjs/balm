declare module 'async';
declare module 'autoprefixer';
declare module 'browser-sync';
declare module 'connect-history-api-fallback';
declare module 'cssnano';
declare module 'fancy-log';
declare module 'gulp';
declare module 'gulp-load-plugins';
declare module 'html-minifier';
declare module 'html-webpack-plugin';
declare module 'imagemin';
declare module 'mini-css-extract-plugin';
declare module 'modernizr';
declare module 'optimize-css-assets-webpack-plugin';
declare module 'parents';
declare module 'postcss-import';
declare module 'postcss-preset-env';
declare module 'postcss-safe-parser';
declare module 'readable-stream';
declare module 'replace-ext';
declare module 'require-dir';
declare module 'sass';
declare module 'ssh2';
declare module 'terser-webpack-plugin';
declare module 'through2';
declare module 'through2-concurrent';
declare module 'vinyl-sourcemaps-apply';
declare module 'webpack-bundle-analyzer';
declare module 'webpack-dev-middleware';
declare module 'webpack-hot-middleware';
declare module 'workbox-build';

declare module '*package.json' {
  var pkg: {
    version: string;
  };

  export default pkg;
}
