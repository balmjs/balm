declare module 'fancy-log' {
  var fancyLog: any;
  export default fancyLog;
}

declare module 'require-dir' {
  var requireDir: any;
  export default requireDir;
}

declare module 'gulp-load-plugins' {
  var $: any;
  export default $;
}

declare module 'browser-sync' {
  var browserSync: any;
  export default browserSync;
}

declare module 'webpack' {
  var webpack: any;
  export default webpack;
}

declare module 'postcss-import' {
  var atImport: any;
  export default atImport;
}

declare module 'postcss-preset-env' {
  var postcssPresetEnv: any;
  export default postcssPresetEnv;
}

declare module 'autoprefixer' {
  var autoprefixer: any;
  export default autoprefixer;
}

declare module 'cssnano' {
  var cssnano: any;
  export default cssnano;
}

declare module 'merge-stream' {
  var mergeStream: any;
  export default mergeStream;
}

declare module 'webpack-merge' {
  var webpackMerge: any;
  export default webpackMerge;
}

declare module 'terser-webpack-plugin' {
  var TerserPlugin: any;
  export default TerserPlugin;
}

declare module 'optimize-css-assets-webpack-plugin' {
  var OptimizeCSSAssetsPlugin: any;
  export default OptimizeCSSAssetsPlugin;
}

declare module 'postcss-safe-parser' {
  var safePostCssParser: any;
  export default safePostCssParser;
}

declare module 'mini-css-extract-plugin' {
  var MiniCssExtractPlugin: any;
  export default MiniCssExtractPlugin;
}

declare module 'webpack-bundle-analyzer' {
  var BundleAnalyzerPlugin: any;
  export { BundleAnalyzerPlugin };
}

declare module 'mkdirp' {
  var mkdirp: any;
  export default mkdirp;
}

declare module 'modernizr' {
  var Modernizr: any;
  export default Modernizr;
}

declare module 'gulp' {
  var gulp: any;
  export default gulp;
  export var series: any;
  export var parallel: any;
  export var watch: any;
  export var tree: any;
}

interface Igulp {
  src: any;
  dest: any;
  lastRun: any;
  series: any;
  parallel: any;
  watch: any;
  task: any;
}

declare namespace NodeJS {
  interface Global {
    gulp: Igulp;
    $: any;
    server: any;
    webpack: any;
  }
}

declare var gulp: Igulp;
declare var $: any;
declare var server: any;
declare var webpack: any;
