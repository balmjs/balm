"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var postcss_1 = __importDefault(require("./postcss"));
var plumber_1 = __importDefault(require("./plumber"));
var htmlmin_1 = __importDefault(require("./htmlmin"));
var jsmin_1 = __importDefault(require("./jsmin"));
var rename_1 = __importDefault(require("./rename"));
var sftp_1 = __importDefault(require("./sftp"));
var plugins = {
    postcss: postcss_1.default,
    plumber: plumber_1.default,
    htmlmin: htmlmin_1.default,
    jsmin: jsmin_1.default,
    rename: rename_1.default,
    sftp: sftp_1.default
};
BalmJS.plugins = plugins;
