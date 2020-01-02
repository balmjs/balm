"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var port = 3000;
var host = null;
var https = undefined;
var open = false;
var localOnly = false; // Support environments where dynamic hostnames are not required (ie: electron)
var proxy = false; // Host: your.project.dev
var serveStatic = [
// {
//     route: '/public',
//     dir: '/path/to/public'
// }
];
/**
 * Browsersync options
 *
 * @reference https://browsersync.io/docs/options
 */
var options = {};
// Middleware
/**
 * A development middleware for webpack
 *
 * @reference https://github.com/webpack/webpack-dev-middleware#options
 */
var devOptions = {
    stats: false
};
/**
 * Webpack hot reloading
 *
 * @reference https://github.com/webpack-contrib/webpack-hot-middleware#config
 */
var hotOptions = {
    reload: true,
    noInfo: true
};
/**
 * Http-proxy middleware
 *
 * @reference https://github.com/chimurai/http-proxy-middleware#context-matching
 * @reference https://github.com/chimurai/http-proxy-middleware#options
 *
 * @example
 * Single proxy example
 * {
 *   context: '/api',
 *   options: {
 *     target: 'http://www.example.org',
 *     changeOrigin: true
 *   }
 * }
 * @example
 * Multiple proxies example
 * [{
 *   context: '/api',
 *   options: {
 *     target: 'http://www.example.org',
 *     changeOrigin: true
 *   }
 * }, {
 *   context: ['/api2', '/api3'],
 *   options: {
 *     target: 'http://www.example2.org',
 *     changeOrigin: true
 *   }
 * }]
 */
var proxyConfig = false;
/**
 * HTML 5 history API
 *
 * @reference https://github.com/bripkens/connect-history-api-fallback#options
 */
var historyOptions = false;
var middlewares = []; // Extra middlewares for server
var extraWatchFiles = []; // Just for `mix.serve`
exports.default = {
    port: port,
    host: host,
    https: https,
    open: open,
    localOnly: localOnly,
    proxy: proxy,
    serveStatic: serveStatic,
    options: options,
    devOptions: devOptions,
    hotOptions: hotOptions,
    proxyConfig: proxyConfig,
    historyOptions: historyOptions,
    middlewares: middlewares,
    extraWatchFiles: extraWatchFiles
};
