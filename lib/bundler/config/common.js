"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var loaders_1 = __importDefault(require("../loaders"));
var constants_1 = require("../../config/constants");
function _getSplitChunks() {
    var scripts = BalmJS.config.scripts;
    var jsFolder = BalmJS.config.paths.target.js;
    var cacheGroups = false;
    if (scripts.extractAllVendors) {
        // All vendors
        var jsFilename = scripts.inject
            ? scripts.vendorName + "." + constants_1.INJECT_HASHNAME + ".js"
            : scripts.vendorName + ".js";
        cacheGroups = {
            vendors: {
                chunks: 'initial',
                name: jsFilename,
                test: /[\\/](node_modules|bower_components)[\\/]/,
                filename: BalmJS.file.assetsPath(jsFolder + "/" + jsFilename) // Output: `js/vendors.js`
            }
        };
    }
    else if (BalmJS.vendors.length) {
        // Custom vendors
        cacheGroups = {};
        for (var _i = 0, _a = BalmJS.vendors; _i < _a.length; _i++) {
            var vendor = _a[_i];
            var cacheGroupKey = vendor.key;
            var cacheGroupModules = vendor.value.join('|');
            var jsFilename = scripts.inject
                ? cacheGroupKey + "." + constants_1.INJECT_HASHNAME + ".js"
                : cacheGroupKey + ".js";
            cacheGroups[cacheGroupKey] = {
                chunks: 'initial',
                name: jsFilename,
                test: new RegExp("[\\\\/](" + cacheGroupModules + ")[\\\\/]"),
                filename: BalmJS.file.assetsPath(path.join(jsFolder, scripts.vendorName, jsFilename)),
                enforce: true
            };
        }
    }
    return cacheGroups ? { cacheGroups: cacheGroups } : false;
}
function getCommonConfig(scripts) {
    var splitChunks = _getSplitChunks();
    var optimization = splitChunks
        ? BalmJS.utils.deepMerge({
            splitChunks: splitChunks
        }, scripts.optimization)
        : scripts.optimization;
    return {
        context: BalmJS.config.workspace,
        mode: 'none',
        module: {
            rules: loaders_1.default(scripts.loaders),
            strictExportPresence: true
        },
        resolve: {
            // (was split into `root`, `modulesDirectories` and `fallback` in the old options)
            // In which folders the resolver look for modules
            // relative paths are looked up in every parent folder (like node_modules)
            // absolute paths are looked up directly
            // the order is respected
            modules: [
                'node_modules',
                'bower_components',
                BalmJS.file.absPath(BalmJS.config.src.base)
            ],
            // These extensions are tried when resolving a file
            extensions: __spreadArrays([
                '.wasm',
                '.mjs',
                '.js',
                '.json',
                '.jsx',
                '.ts',
                '.tsx',
                '.vue'
            ], scripts.extensions),
            // These aliasing is used when trying to resolve a module
            alias: scripts.alias,
            // These JSON files are read in directories
            descriptionFiles: ['package.json', 'bower.json'],
            // These fields in the description files are looked up when trying to resolve the package directory
            mainFields: ['main', 'browser', 'module']
        },
        optimization: optimization,
        plugins: __spreadArrays([
            // Moment.js is an extremely popular library that bundles large locale files
            // by default due to how Webpack interprets its code. This is a practical
            // solution that requires the user to opt into importing specific locales.
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            // You can remove this if you don't use Moment.js:
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ], scripts.plugins),
        target: scripts.target,
        stats: scripts.stats
    };
}
exports.default = getCommonConfig;
