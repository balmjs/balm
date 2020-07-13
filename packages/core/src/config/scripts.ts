import { BalmEntryObject } from '@balm-types/index';

interface PostcssLoaderOptions {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  stringifier?: string | object;
  config?: object;
  plugins?: object[] | Function; // NOTE: The same to `styles.postcssPlugins`
  sourceMap: string | boolean;
}

// Entry and Context
const entry: string | string[] | BalmEntryObject = '';
// Output
const library: string | object = '';
const libraryTarget = 'var'; // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
// Module
const loaders: object[] = [];
const includeJsResource: string[] = [];
const defaultLoaders: {
  html?: boolean;
  css?: boolean;
  js?: boolean;
  url?: boolean;
} = {};
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
const postcssLoaderOptions: PostcssLoaderOptions = {
  sourceMap: false
};
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
/**
 * Full custom webpack configuration
 *
 * @reference https://webpack.js.org/configuration/
 */
const webpackOptions: object = {};
// Other advanced options
const lint = false;
/**
 * Terser minify options
 *
 * @reference https://github.com/terser/terser#minify-options
 */
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
/**
 * Webpack optimizations for manual configuration and overrides
 *
 * @reference https://webpack.js.org/configuration/optimization/
 */
const optimization: object = {};
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

export default {
  entry,
  library,
  libraryTarget,
  loaders,
  includeJsResource,
  defaultLoaders,
  urlLoaderOptions,
  htmlLoaderOptions,
  postcssLoaderOptions,
  extensions,
  alias,
  plugins,
  hot,
  sourceMap,
  target,
  externals,
  stats,
  webpackOptions,
  lint,
  options,
  inject,
  optimization,
  extractAllVendors,
  vendorName,
  extractCss,
  ie8
};
