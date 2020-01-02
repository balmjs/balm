"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Entry and Context
var entry = '';
// Output
var library = '';
var libraryTarget = 'var'; // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
// Module
var loaders = [];
var includeJsResource = [];
var disableDefaultLoaders = {};
var urlLoaderOptions = {};
// Resolve
var extensions = [];
var alias = {};
// Plugins
var plugins = [];
// DevServer
var hot = true;
// Devtool
var sourceMap = false;
// Target
var target = 'web';
// Externals
var externals = '';
// Stats
var stats = {
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
var webpackOptions = {};
// Other advanced options
var lint = false;
/**
 * Terser minify options
 *
 * @reference https://github.com/terser/terser#minify-options
 */
var options = {
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
var inject = false;
// Optimization
/**
 * Webpack optimizations for manual configuration and overrides
 *
 * @reference https://webpack.js.org/configuration/optimization/
 */
var optimization = {};
var extractAllVendors = false; // Extract all vendors (all in one)
var vendorName = 'vendor'; // AllInOne vendor filename or Vendors folder name
// Extract CSS
var extractCss = {
    enabled: false,
    prefix: ''
};
// IE8 compatibility
var ie8 = false;
exports.default = {
    entry: entry,
    library: library,
    libraryTarget: libraryTarget,
    loaders: loaders,
    includeJsResource: includeJsResource,
    disableDefaultLoaders: disableDefaultLoaders,
    urlLoaderOptions: urlLoaderOptions,
    extensions: extensions,
    alias: alias,
    plugins: plugins,
    hot: hot,
    sourceMap: sourceMap,
    target: target,
    externals: externals,
    stats: stats,
    webpackOptions: webpackOptions,
    lint: lint,
    options: options,
    inject: inject,
    optimization: optimization,
    extractAllVendors: extractAllVendors,
    vendorName: vendorName,
    extractCss: extractCss,
    ie8: ie8
};
