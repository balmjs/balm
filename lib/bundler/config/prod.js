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
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
var postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var common_1 = __importDefault(require("./common"));
// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
var bundleAnalyzerReport = process.env.npm_config_report || false;
function getProdConfig(scripts) {
    var shouldUseSourceMap = scripts.sourceMap;
    var terserOptions = scripts.options;
    if (BalmJS.config.scripts.ie8) {
        terserOptions.ie8 = true;
    }
    return webpack_merge_1.default(common_1.default(scripts), {
        mode: 'production',
        optimization: {
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: terserOptions,
                    extractComments: false
                }),
                new optimize_css_assets_webpack_plugin_1.default({
                    cssProcessorOptions: {
                        parser: postcss_safe_parser_1.default,
                        map: shouldUseSourceMap
                            ? {
                                // `inline: false` forces the sourcemap to be output into a
                                // separate file
                                inline: false,
                                // `annotation: true` appends the sourceMappingURL to the end of
                                // the css file, helping the browser find the sourcemap
                                annotation: true
                            }
                            : false
                    }
                })
            ]
        },
        plugins: __spreadArrays([
            // Keep module.id stable when vendor modules does not change
            new webpack.HashedModuleIdsPlugin()
        ], (scripts.extractCss.enabled
            ? [
                new mini_css_extract_plugin_1.default({
                    filename: BalmJS.file.assetsPath(BalmJS.config.paths.target.css + "/" + scripts.extractCss.prefix + "[name].css"),
                    chunkFilename: BalmJS.file.assetsPath(BalmJS.config.paths.target.css + "/[id].css")
                })
            ]
            : []), (bundleAnalyzerReport ? [new webpack_bundle_analyzer_1.BundleAnalyzerPlugin()] : [])),
        devtool: shouldUseSourceMap ? 'source-map' : false
    });
}
exports.default = getProdConfig;
