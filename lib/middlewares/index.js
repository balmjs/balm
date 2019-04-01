import getWebpackMiddleware from './webpack';
import getProxyMiddleware from './proxy';
import history from 'connect-history-api-fallback';
import { isObject } from '../utilities';

const getMiddleware = () => {
  let middleware;

  if (config.scripts.entry && config.isDev) {
    let historyOptions = config.server.historyOptions;

    middleware = [
      // Hot reload
      ...(config.isDev ? getWebpackMiddleware() : []),
      // Http proxy
      ...getProxyMiddleware(),
      // H5
      ...(historyOptions
        ? [isObject(historyOptions) ? history(historyOptions) : history()]
        : []),
      // Yours
      ...(config.server.middlewares.length ? config.server.middlewares : [])
    ];
  }

  return middleware;
};

export default getMiddleware;
