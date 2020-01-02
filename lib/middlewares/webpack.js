"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
var webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
var constants_1 = require("../config/constants");
function webpackMiddleware() {
    var middleware = [];
    if (BalmJS.webpackCompiler) {
        middleware.push(webpack_dev_middleware_1.default(BalmJS.webpackCompiler, Object.assign({}, BalmJS.config.server.devOptions, {
            publicPath: BalmJS.file.publicPath
        })));
        if (BalmJS.config.scripts.hot) {
            middleware.push(webpack_hot_middleware_1.default(BalmJS.webpackCompiler, {
                log: false,
                path: constants_1.HMR_PATH
            }));
        }
    }
    else {
        BalmJS.logger.warn('webpack middleware', 'Webpack compiler is not ready, `HMR` is disabled');
        BalmJS.config.scripts.hot = false;
    }
    return middleware;
}
exports.default = webpackMiddleware;
