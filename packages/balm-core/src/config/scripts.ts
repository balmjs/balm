import {
  BalmBundler,
  MinifyOptions,
  BalmEntry,
  Library,
  LibraryTarget,
  RuleSetRule,
  BalmLoaders,
  PostcssLoaderOptions,
  ResolveAlias,
  SourceMap,
  Target,
  ExternalsElement,
  StatsValue,
  Configuration,
  Optimization,
  InputOptions,
  OutputOptions,
  WatcherOptions,
  BuildOptions,
  TransformOptions
} from '@balm-core/index';

// Base options
const bundler: BalmBundler = 'webpack';
/**
 * Terser minify options
 *
 * @reference https://github.com/terser/terser#minify-options
 */
const minifyOptions: MinifyOptions = {
  ecma: 5,
  parse: {
    // We want terser to parse ecma 8 code. However, we don't want it
    // to apply any minfication steps that turns valid ecma 5 code
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
    // Pending futher investigation:
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
const library: Library = '';
const libraryTarget: LibraryTarget = 'var';
// Module
const loaders: RuleSetRule[] = [];
const defaultLoaders: Partial<BalmLoaders> = {};
const includeJsResource: string[] = [];
const excludeUrlResource: string[] = [];
const useEsModule = true;
/**
 * Files: url-loader options
 *
 * @reference https://github.com/webpack-contrib/url-loader#options
 */
const urlLoaderOptions: object = {};
/**
 * Templating: html-loader options
 *
 * @reference https://github.com/webpack-contrib/html-loader#options
 */
const htmlLoaderOptions: object = {};
/**
 * Styling: postcss-loader options
 *
 * @reference https://github.com/postcss/postcss-loader#options
 */
const postcssLoaderOptions: Partial<PostcssLoaderOptions> = {};
// Resolve
const extensions: string[] = [];
const alias: ResolveAlias = {};
// Plugins
const plugins: object[] = [];
// Devtool
const sourceMap: SourceMap = false;
// Target
const target: Target = 'web';
// Externals
const externals: ExternalsElement | ExternalsElement[] = '';
// Stats
const stats: StatsValue = {
  colors: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: false
};
/**
 * Full custom webpack configuration
 *
 * @reference https://webpack.js.org/configuration/
 */
const webpackOptions: Configuration = {};
// SSR support
const inject = false;
// Optimization
/**
 * Webpack optimizations for manual configuration and overrides
 *
 * @reference https://webpack.js.org/configuration/optimization/
 */
const optimization: Optimization = {};
const extractAllVendors = false; // Extract all vendors (all in one)
const vendorName = 'vendor'; // AllInOne vendor filename or Vendors folder name
// Extract CSS
const extractCss: {
  enabled: boolean;
  prefix: string;
} = {
  enabled: false,
  prefix: ''
};
// IE8 compatibility
const ie8 = false;

/**
 * Rollup bundler
 */
const inputOptions: InputOptions = {};
const outputOptions: OutputOptions = {};
const watchOptions: WatcherOptions = {};

/**
 * Esbuild bundler
 */
const buildOptions: BuildOptions = {};
const useTransform = false;
const transformOptions: TransformOptions = {};

export default {
  // base
  bundler,
  minifyOptions,
  entry,
  lint,
  // webpack
  library,
  libraryTarget,
  loaders,
  defaultLoaders,
  includeJsResource,
  excludeUrlResource,
  useEsModule,
  urlLoaderOptions,
  htmlLoaderOptions,
  postcssLoaderOptions,
  extensions,
  alias,
  plugins,
  sourceMap,
  target,
  externals,
  stats,
  webpackOptions,
  inject,
  optimization,
  extractAllVendors,
  vendorName,
  extractCss,
  ie8,
  // rollup
  inputOptions,
  outputOptions,
  watchOptions,
  // esbuild
  buildOptions,
  useTransform,
  transformOptions
};
