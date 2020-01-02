"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./globals");
var env_1 = __importDefault(require("./env"));
var roots_1 = __importDefault(require("./roots"));
var paths_1 = __importDefault(require("./paths"));
var html_1 = __importDefault(require("./html"));
var styles_1 = __importDefault(require("./styles"));
var scripts_1 = __importDefault(require("./scripts"));
var extras_1 = __importDefault(require("./extras"));
var assets_1 = __importDefault(require("./assets"));
var server_1 = __importDefault(require("./server"));
var ftp_1 = __importDefault(require("./ftp"));
var pwa_1 = __importDefault(require("./pwa"));
var logs_1 = __importDefault(require("./logs"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
var noop = function () { };
var vendors = [];
var workspace = process.cwd();
/**
 * Project type
 *
 * set `true` for a static HTML project
 * set `false` for a dynamic language project (e.g. PHP framework)
 */
var inFrontend = true;
var useDefaults = true; // Use balm default task
var config = {
    env: env_1.default,
    workspace: workspace,
    inFrontend: inFrontend,
    useDefaults: useDefaults,
    roots: roots_1.default,
    paths: paths_1.default,
    html: html_1.default,
    styles: styles_1.default,
    scripts: scripts_1.default,
    extras: extras_1.default,
    assets: assets_1.default,
    server: server_1.default,
    ftp: ftp_1.default,
    pwa: pwa_1.default,
    logs: logs_1.default
};
BalmJS.config = config;
BalmJS.noop = noop;
BalmJS.LogLevel = LogLevel;
BalmJS.vendors = vendors;
exports.default = config;
