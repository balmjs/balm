"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
// Style files regexes
var cssRegex = /\.css$/;
var cssModuleRegex = /\.module\.css$/;
function cssLoader() {
    var styleLoader = 'style-loader';
    BalmJS.config.styles.postcssLoaderOptions.plugins = BalmJS.plugins.postcss();
    if (BalmJS.config.env.inSSR) {
        var loadersCount = BalmJS.config.scripts.loaders.length;
        for (var i = 0; i < loadersCount; i++) {
            if (BalmJS.config.scripts.loaders[i].loader ===
                'vue-loader') {
                styleLoader = 'vue-style-loader';
                break;
            }
        }
    }
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    // By default we support CSS Modules with the extension .module.css
    return {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [
            BalmJS.config.env.isProd && BalmJS.config.scripts.extractCss.enabled
                ? mini_css_extract_plugin_1.default.loader
                : styleLoader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    sourceMap: BalmJS.config.env.isProd && BalmJS.config.scripts.sourceMap
                }
            },
            {
                loader: 'postcss-loader',
                options: BalmJS.config.styles.postcssLoaderOptions
            }
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true
    };
}
exports.default = cssLoader;
