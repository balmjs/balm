"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../config/constants");
var FILENAME_REGEX = new RegExp('[^/]+$', 'i');
var HOT_CLIENT = 'webpack-hot-middleware/client';
function initVendors(entries) {
    var vendors = [];
    for (var _i = 0, _a = Object.keys(entries); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = entries[key];
        if (BalmJS.utils.isArray(value)) {
            vendors.push({
                key: key,
                value: value
            });
        }
    }
    // if (vendors.length) {
    //   const vendorKeys: string[] = Array.from(
    //     new Set(vendors.map(vendor => vendor.key))
    //   );
    //   if (vendorKeys.length === vendors.length) {
    //     BalmJS.vendors = vendors;
    //   } else {
    //     BalmJS.logger.warn('webpack entry', 'conflicting vendors key');
    //   }
    // }
    BalmJS.vendors = vendors.length ? vendors : [];
}
// Relative path
function getEntry(input, scripts) {
    var webpackEntries = {};
    var hotOptions = Object.assign({}, BalmJS.config.server.hotOptions, {
        path: constants_1.HMR_PATH
    });
    var HMR = HOT_CLIENT + "?" +
        Object.entries(hotOptions)
            .map(function (option) { return option.join('='); })
            .join('&');
    var useHMR = scripts.hot &&
        BalmJS.config.useDefaults &&
        BalmJS.config.env.isDev &&
        !BalmJS.config.env.inSSR &&
        !BalmJS.config.scripts.ie8;
    if (BalmJS.utils.isObject(input)) {
        initVendors(input);
        for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = input[key];
            var isVendor = BalmJS.utils.isArray(value);
            // Key
            var entryKey = isVendor
                ? path.join(scripts.vendorName, key)
                : path.join(key);
            // Value
            var hotValue = BalmJS.utils.isString(value)
                ? [value, HMR]
                : __spreadArrays(value, [HMR]);
            var entryValue = useHMR ? hotValue : value;
            // Result
            if (!isVendor) {
                webpackEntries[entryKey] = entryValue;
            }
        }
    }
    else if (BalmJS.utils.isArray(input) && input.length) {
        for (var _b = 0, _c = input; _b < _c.length; _b++) {
            var value = _c[_b];
            var matchResult = FILENAME_REGEX.exec(value)[0];
            var key = matchResult.split('.')[0];
            webpackEntries[key] = useHMR ? [value, HMR] : value;
        }
    }
    else if (BalmJS.utils.isString(input) && input.trim().length) {
        webpackEntries = useHMR ? [input, HMR] : input;
    }
    else {
        BalmJS.logger.warn('webpack entry', 'scripts entry must be a `string | array | object`');
    }
    BalmJS.logger.debug('webpack entry', webpackEntries, {
        pre: true
    });
    return webpackEntries;
}
exports.default = getEntry;
