import proxy from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import webpackMiddleware from './webpack';
import { isObject } from '../utilities';

const getMiddleware = () => {
  let middleware;

  if (config.scripts.entry && !config.production) {
    let historyOptions = config.server.historyOptions;

    middleware = [
      ...webpackMiddleware,
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
