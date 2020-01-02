"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __importDefault(require("util"));
var fancy_log_1 = __importDefault(require("fancy-log"));
var color_1 = __importDefault(require("./color"));
var LOG = {
    FORMAT: '%s %s %s',
    PREFIX: color_1.default('BalmJS', {
        color: 'blue',
        background: true,
        bright: true
    }),
    OK: {
        color: 'green',
        bright: true,
        symbol: 'check'
    },
    DEBUG: {
        color: 'blue',
        bright: true,
        symbol: 'mark'
    },
    INFO: {
        color: 'cyan',
        bright: true,
        symbol: 'info'
    },
    WARN: {
        color: 'yellow',
        bright: true,
        symbol: 'warning'
    },
    ERROR: {
        color: 'red',
        bright: true,
        symbol: 'cross'
    },
    beginning: '$'.padStart(36, '*'),
    end: '^'.padEnd(36, '.')
};
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype._log = function (obj, pre) {
        if (pre === void 0) { pre = false; }
        return pre
            ? util_1.default.inspect(obj, Object.assign({
                showHidden: false,
                depth: 2,
                colors: true
            }, BalmJS.config.logs.formatOptions))
            : obj;
    };
    Logger.prototype.success = function (label, message, options) {
        if (options === void 0) { options = {}; }
        var logOptions = Object.assign({
            logLevel: BalmJS.LogLevel.Trace
        }, options);
        if (BalmJS.config.logs.level <= logOptions.logLevel) {
            console.log(LOG.beginning);
            fancy_log_1.default(LOG.FORMAT, LOG.PREFIX, color_1.default("<" + label + ">", LOG.OK), this._log(message, logOptions.pre));
            console.log(LOG.end);
        }
    };
    Logger.prototype.debug = function (label, message, options) {
        if (options === void 0) { options = {}; }
        var logOptions = Object.assign({
            logLevel: BalmJS.LogLevel.Debug
        }, options);
        if (BalmJS.config.logs.level <= logOptions.logLevel) {
            fancy_log_1.default.info(LOG.FORMAT, LOG.PREFIX, color_1.default("<" + label + ">", LOG.DEBUG), this._log(message, logOptions.pre));
        }
    };
    Logger.prototype.info = function (label, message, options) {
        if (options === void 0) { options = {}; }
        var logOptions = Object.assign({
            logLevel: BalmJS.LogLevel.Info
        }, options);
        if (BalmJS.config.logs.level <= logOptions.logLevel) {
            fancy_log_1.default.info(LOG.FORMAT, LOG.PREFIX, color_1.default("<" + label + ">", LOG.INFO), this._log(message, logOptions.pre));
        }
    };
    Logger.prototype.warn = function (label, message, options) {
        if (options === void 0) { options = {}; }
        var logOptions = Object.assign({
            logLevel: BalmJS.LogLevel.Warn
        }, options);
        if (BalmJS.config.logs.level <= logOptions.logLevel) {
            fancy_log_1.default.warn(LOG.FORMAT, LOG.PREFIX, color_1.default("<" + label + ">", LOG.WARN), this._log(message, logOptions.pre));
        }
    };
    Logger.prototype.error = function (label, message, pre) {
        if (pre === void 0) { pre = false; }
        fancy_log_1.default.error(LOG.FORMAT, LOG.PREFIX, color_1.default("<" + label + ">", LOG.ERROR), this._log(message, pre));
    };
    return Logger;
}());
exports.default = new Logger();
