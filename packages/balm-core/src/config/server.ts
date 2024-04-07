import { BalmProxyOptions } from '@balm-core/index';

const port = 3000;
const host: string | null = null;
const https: boolean | undefined = undefined;
const open: string | boolean = false;
const proxy: string | boolean | object = false; // Host: your.project.dev
const serveStatic: string[] = [
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
const options: object = {};
const next: Function = NOOP;
// Middleware
/**
 * A development middleware for webpack
 *
 * @reference https://github.com/webpack/webpack-dev-middleware#options
 */
const devOptions: object = {};
/**
 * Webpack hot reloading
 *
 * @reference https://github.com/webpack-contrib/webpack-hot-middleware#config
 */
const hotOptions: object = {
  reload: true,
  noInfo: true
};
/**
 * Http-proxy middleware
 *
 * @reference https://github.com/chimurai/http-proxy-middleware#options
 *
 * @example
 * Single proxy example
 * {
 *   target: 'http://www.example.org',
 *   changeOrigin: true,
 *   pathFilter: '/api'
 * }
 * @example
 * Multiple proxies example
 * [{
 *   target: 'http://www.example.org',
 *   changeOrigin: true,
 *   pathFilter: '/api'
 * }, {
 *   target: 'http://www.example2.org',
 *   changeOrigin: true,
 *   pathFilter: ['/api2', '/api3']
 * }]
 */
const proxyOptions: boolean | BalmProxyOptions | BalmProxyOptions[] = false;
/**
 * HTML 5 history API
 *
 * @reference https://github.com/bripkens/connect-history-api-fallback#options
 */
const historyOptions: boolean | object = false;
const middlewares: Function[] | object[] = []; // Extra middlewares for server
const extraWatchFiles: string[] = []; // Just for `mix.serve`

export default {
  port,
  host,
  https,
  open,
  proxy,
  serveStatic,
  options,
  next,
  devOptions,
  hotOptions,
  proxyOptions,
  historyOptions,
  middlewares,
  extraWatchFiles
};
