import {
  BalmBundler,
  MinifyOptions,
  BalmEntry,
  RuleSetRule,
  BalmLoaders,
  PostcssLoaderOptions,
  Configuration,
  InputOptions,
  OutputOptions,
  BuildOptions,
  TransformOptions
} from '@balm-core/index';

// Base options
const bundler: BalmBundler = 'webpack';
const minify = false;
/**
 * Terser minify options
 *
 * @reference https://github.com/terser/terser#minify-options
 */
const minifyOptions: MinifyOptions = {
  ecma: 5,
  parse: {
    // We want terser to parse ecma 8 code. However, we don't want it
    // to apply any minification steps that turns valid ecma 5 code
    // into invalid ecma 5 code. This is why the 'compress' and 'output'
    // sections only apply transformations that are ecma 5 safe
    // https://github.com/facebook/create-react-app/pull/4234
    ecma: 2017
  },
  compress: {
    // Disabled because of an issue with Uglify breaking seemingly valid code:
    // https://github.com/facebook/create-react-app/issues/2376
    // Pending further investigation:
    // https://github.com/mishoo/UglifyJS2/issues/2011
    comparisons: false,
    // Disabled because of an issue with Terser breaking valid code:
    // https://github.com/facebook/create-react-app/issues/5250
    // Pending further investigation:
    // https://github.com/terser-js/terser/issues/120
    inline: 2
  },
  mangle: {
    safari10: true
  },
  output: {
    comments: false,
    // Turned on because emoji and regex is not minified properly using default
    // https://github.com/facebook/create-react-app/issues/2488
    ascii_only: true
  }
};
// Entry and Context (webpack/esbuild common options)
const entry: BalmEntry = '';
const lint = false;

/**
 * Webpack bundler
 */

// Output
const library: string | object = '';
// Module
const loaders: RuleSetRule[] = [];
const defaultLoaders: Partial<BalmLoaders> = {};
const includeJsResource: string[] = [];
const useEsModule = true;
/**
 * Scripts: babel-loader options
 *
 * @reference https://github.com/babel/babel-loader#options
 */
const babelLoaderOptions: object = {};
/**
 * Styling: postcss-loader options
 *
 * @reference https://github.com/postcss/postcss-loader#options
 */
const postcssLoaderOptions: Partial<PostcssLoaderOptions> = {};
/**
 * Templating: html-loader options
 *
 * @reference https://github.com/webpack-contrib/html-loader#options
 */
const htmlLoaderOptions: object = {};
// Resolve
const extensions: string[] = [];
const alias: object = {};
// Plugins
const plugins: object[] = [];
const injectHtml = false;
const htmlPluginOptions: object = {};
const extractCss = false;
// Devtool
const sourceMap: string | boolean = false;
// Target
const target: string | string[] | false = ['web', 'es5'];
// Externals
const externals: string | string[] | object | Function | RegExp = '';
// Stats
const stats: object | string = {
  colors: true,
  assets: true,
  children: false,
  chunks: false,
  modules: false
};
/**
 * Full custom webpack configuration
 *
 * @reference https://webpack.js.org/configuration/
 */
const webpackOptions: Configuration = {};
// Optimization
/**
 * Webpack optimizations for manual configuration and overrides
 *
 * @reference https://webpack.js.org/configuration/optimization/
 */
const optimization: object = {};
const extractAllVendors = false; // Extract all vendors (all in one)
const vendorName = 'vendor'; // AllInOne vendor filename or Vendors folder name
// IE8 compatibility
const ie8 = false;

/**
 * Rollup bundler
 */
const inputOptions: InputOptions = {};
const outputOptions: OutputOptions = {};

/**
 * Esbuild bundler
 */
const buildOptions: BuildOptions = {};
const useTransform = false;
const transformOptions: TransformOptions = {};

export default {
  // base
  bundler,
  minify,
  minifyOptions,
  entry,
  lint,
  // webpack
  library,
  loaders,
  defaultLoaders,
  includeJsResource,
  useEsModule,
  babelLoaderOptions,
  postcssLoaderOptions,
  htmlLoaderOptions,
  extensions,
  alias,
  plugins,
  injectHtml,
  htmlPluginOptions,
  extractCss,
  sourceMap,
  target,
  externals,
  stats,
  webpackOptions,
  optimization,
  extractAllVendors,
  vendorName,
  ie8,
  // rollup
  inputOptions,
  outputOptions,
  // esbuild
  buildOptions,
  useTransform,
  transformOptions
};
