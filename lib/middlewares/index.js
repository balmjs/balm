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
var webpack_1 = __importDefault(require("./webpack"));
var proxy_1 = __importDefault(require("./proxy"));
var history_1 = __importDefault(require("./history"));
function getMiddlewares() {
    return __spreadArrays(webpack_1.default(), proxy_1.default(), history_1.default(), BalmJS.config.server.middlewares);
}
exports.default = getMiddlewares;
