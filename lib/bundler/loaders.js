"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var require_dir_1 = __importDefault(require("require-dir"));
var LOADERS = require_dir_1.default('./rules');
function getLoaders(customLoaders) {
    var enableDefaultLoaders = Object.assign({
        html: true,
        css: true,
        js: true,
        url: true
    }, BalmJS.config.scripts.disableDefaultLoaders);
    var useDefaultLoaders = Object.values(enableDefaultLoaders).some(function (value) { return value; });
    var defaultLoaders = [];
    if (useDefaultLoaders) {
        Object.values(LOADERS).forEach(function (Loader) {
            var DefaultLoader = Loader.default;
            var key = DefaultLoader.name.replace('Loader', '');
            if (enableDefaultLoaders[key]) {
                var loader = DefaultLoader();
                if (BalmJS.utils.isArray(loader)) {
                    defaultLoaders = defaultLoaders.concat(loader);
                }
                else {
                    defaultLoaders.push(loader);
                }
            }
        });
    }
    var result = webpack_merge_1.default.smart({
        rules: defaultLoaders
    }, {
        rules: customLoaders
    });
    BalmJS.logger.debug('webpack loaders', result.rules, {
        pre: true
    });
    return result.rules;
}
exports.default = getLoaders;
