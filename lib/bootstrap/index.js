"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../config/constants");
var check_config_1 = __importDefault(require("./check_config"));
function _createQuickPath(config, rootKey) {
    var result = {};
    var rootValue = config.roots[rootKey];
    for (var _i = 0, _a = Object.keys(config.paths[rootKey]); _i < _a.length; _i++) {
        var pathKey = _a[_i];
        var pathValue = config.paths[rootKey][pathKey];
        result[pathKey] =
            rootKey === 'target' && constants_1.ASSETS_KEYS.includes(pathKey)
                ? path.join(rootValue, BalmJS.config.assets.virtualDir, BalmJS.file.assetsSuffixPath, pathValue)
                : path.join(rootValue, pathValue);
    }
    return result;
}
function _ready(config) {
    // Create local quick directories
    config.src = _createQuickPath(config, 'source');
    config.dest = _createQuickPath(config, config.env.isProd || !config.inFrontend ? 'target' : 'tmp');
    config.dest.static = path.join(config.dest.base, BalmJS.config.assets.virtualDir, BalmJS.file.assetsSuffixPath);
    // Create remote quick directories
    config.assets.static = path.join(config.assets.root, config.assets.mainDir, BalmJS.file.assetsSuffixPath);
    for (var _i = 0, ASSETS_KEYS_1 = constants_1.ASSETS_KEYS; _i < ASSETS_KEYS_1.length; _i++) {
        var assetKey = ASSETS_KEYS_1[_i];
        config.assets[assetKey] = path.join(config.assets.static, config.paths.target[assetKey]);
    }
    return config;
}
function _resetConfig() {
    BalmJS.config.roots.target = 'dist';
    BalmJS.config.roots.tmp = '.tmp';
    return BalmJS.config;
}
function setConfig(customConfig) {
    var defaultConfig = _resetConfig();
    // 1. Overwrite config
    var newConfig = BalmJS.utils.deepMerge(defaultConfig, customConfig);
    check_config_1.default();
    // 2. Copy `config.paths.target` to `config.paths.tmp`
    var config = BalmJS.utils.deepMerge(newConfig, {
        paths: {
            tmp: newConfig.paths.target
        }
    });
    // 3. For the dynamic project
    if (!config.inFrontend) {
        if (BalmJS.config.roots.target === 'dist') {
            BalmJS.config.roots.target = BalmJS.config.assets.mainDir; // NOTE: `BalmJS.config.roots.target = 'public'` for back-end project
        }
        config.roots.tmp = config.roots.target;
    }
    // 4. Before created
    config = _ready(config);
    BalmJS.logger.success('balm configuration', config, {
        pre: true
    });
    return config;
}
exports.setConfig = setConfig;
function setTask(name) {
    var result = undefined;
    if (BalmJS.utils.isFunction(name)) {
        result = name;
    }
    else if (BalmJS.utils.isString(name)) {
        if (gulp.tree().nodes.includes(name)) {
            result = name;
        }
        else {
            BalmJS.logger.error('gulp task', 'Invalid task name');
        }
    }
    else {
        BalmJS.logger.error('gulp task', 'Task must be a string or function');
    }
    return result;
}
exports.setTask = setTask;
