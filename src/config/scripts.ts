import { ObjectEntry } from './types';

// Entry and Context
const entry: string | string[] | ObjectEntry = '';
// Output
const library: string | object = '';
const libraryTarget = 'var'; // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
// Module
const loaders: object[] = [];
const includeJsResource: string[] = [];
const disableDefaultLoaders: object = {};
// Resolve
const extensions: string[] = [];
const alias: object = {};
// Plugins
const plugins: object[] = [];
// DevServer
const hot = true;
// Devtool
const sourceMap: string | boolean = false;
// Target
const target = 'web';
// Externals
const externals: string | object | Function | RegExp = '';
// Stats
const stats: string | object = {
  colors: true,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false
};
// Full custom configuration
const webpackOptions: object = {};
// Other advanced options
const eslint = false;
const options: object = {
  parse: {
    // We want terser to parse ecma 8 code. However, we don't want it
    // to apply any minfication steps that turns valid ecma 5 code
    // into invalid ecma 5 code. This is why the 'compress' and 'output'
    // sections only apply transformations that are ecma 5 safe
    // https://github.com/facebook/create-react-app/pull/4234
    ecma: 8
  },
  compress: {
    ecma: 5,
    warnings: false,
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
    ecma: 5,
    comments: false,
    // Turned on because emoji and regex is not minified properly using default
    // https://github.com/facebook/create-react-app/issues/2488
    ascii_only: true
  }
};
// SSR support
const inject = false;
// Optimization
const optimization: object = {};
const splitAllVendors = false;
const vendorsName = 'vendors'; // AllInOne vendor filename or Vendors folder name
// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport: any = process.env.npm_config_report;
// Extract CSS
const extractCss: object = {
  enabled: false,
  prefix: ''
};
// Loads files as `base64` encoded URL
const base64Limit = 10000;

export default {
  entry,
  library,
  libraryTarget,
  loaders,
  includeJsResource,
  disableDefaultLoaders,
  extensions,
  alias,
  plugins,
  hot,
  sourceMap,
  target,
  externals,
  stats,
  webpackOptions,
  eslint,
  options,
  inject,
  optimization,
  splitAllVendors,
  vendorsName,
  bundleAnalyzerReport,
  extractCss,
  base64Limit
};
