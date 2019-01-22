import proxy from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import getWebpackMiddleware from './webpack';
import { isObject } from '../utilities';

if (config.server.proxyTable) {
  logger.warn(
    '[Server]',
    '`server.proxyTable` was removed in balm@0.18.0. Use `server.proxyContext`, `server.proxyOptions` instead. (See https://balmjs.com/docs/en/configuration/server.html)'
  );
}

const getMiddleware = () => {
  let middleware;

  if (config.scripts.entry && !config.isProd) {
    let historyOptions = config.server.historyOptions;

    middleware = [
      ...(config.isDev ? getWebpackMiddleware() : []),
      ...(config.server.proxyOptions
        ? [
            ...(config.server.proxyContext
              ? [proxy(config.server.proxyContext, config.server.proxyOptions)]
              : [proxy(config.server.proxyOptions)])
          ]
        : []),
      ...(historyOptions
        ? [isObject(historyOptions) ? history(historyOptions) : history()]
        : []),
      ...(config.server.middlewares.length ? config.server.middlewares : [])
    ];
  }

  return middleware;
};

export default getMiddleware;
