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
var postcss_import_1 = __importDefault(require("postcss-import"));
var postcss_preset_env_1 = __importDefault(require("postcss-preset-env"));
var autoprefixer_1 = __importDefault(require("autoprefixer"));
function getDefaultPostcssPlugins() {
    var defaultPostcssPlugins = BalmJS.config.styles.extname === 'css'
        ? __spreadArrays([
            postcss_import_1.default({ path: BalmJS.file.stylePaths }),
            postcss_preset_env_1.default(BalmJS.config.styles.postcssEnvOptions),
            autoprefixer_1.default()
        ], BalmJS.config.styles.postcssPlugins) : [autoprefixer_1.default()];
    return defaultPostcssPlugins;
}
exports.default = getDefaultPostcssPlugins;
