"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_proxy_middleware_1 = __importDefault(require("http-proxy-middleware"));
function _handleProxyConfigError() {
    var configuration = '{ context: string | array, options: object }';
    BalmJS.logger.error('proxy middleware', "Proxy config must be an object (" + configuration + ") or array ([" + configuration + "])");
}
function httpProxyMiddleware() {
    var middleware = [];
    var proxyConfig = BalmJS.config.server.proxyConfig;
    if (proxyConfig) {
        if (BalmJS.utils.isObject(proxyConfig)) {
            // Single proxy
            var config = proxyConfig;
            if (config.context && config.options) {
                middleware.push(http_proxy_middleware_1.default(config.context, config.options));
            }
            else {
                _handleProxyConfigError();
            }
        }
        else if (BalmJS.utils.isArray(proxyConfig)) {
            // Multiple proxies
            for (var _i = 0, _a = proxyConfig; _i < _a.length; _i++) {
                var config = _a[_i];
                if (config.context && config.options) {
                    middleware.push(http_proxy_middleware_1.default(config.context, config.options));
                }
                else {
                    _handleProxyConfigError();
                }
            }
        }
        else {
            _handleProxyConfigError();
        }
    }
    return middleware;
}
exports.default = httpProxyMiddleware;
