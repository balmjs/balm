"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var entry_1 = __importDefault(require("./entry"));
var output_1 = __importDefault(require("./output"));
var config_1 = __importDefault(require("./config"));
function webpackConfig(input, output, customOptions, isHook) {
    if (customOptions === void 0) { customOptions = {}; }
    if (isHook === void 0) { isHook = false; }
    var scripts = BalmJS.config.scripts;
    var defaultEntry = "./" + BalmJS.config.roots.source + "/" + BalmJS.config.paths.source.js + "/index.js";
    var baseConfig = {
        entry: input ? entry_1.default(input, scripts) : defaultEntry,
        output: output_1.default(output, scripts, isHook)
    };
    if (scripts.externals) {
        baseConfig.externals = scripts.externals;
    }
    if (scripts.target === 'web') {
        baseConfig.node = {
            // Prevent webpack from injecting useless setImmediate polyfill because Vue
            // source contains it (although only uses it if it's native).
            setImmediate: false,
            // Prevent webpack from injecting mocks to Node native modules
            // that does not make sense for the client
            module: 'empty',
            dgram: 'empty',
            dns: 'mock',
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty'
        };
    }
    var defaultConfig = config_1.default(scripts);
    var configuration = webpack_merge_1.default(baseConfig, defaultConfig, scripts.webpackOptions, customOptions);
    BalmJS.logger.success('webpack configuration', configuration, {
        pre: true
    });
    return configuration;
}
exports.default = webpackConfig;
